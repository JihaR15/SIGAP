const db = require('../config/db');

async function recordAudit(incidentId, userId, aksi, dataSebelumnya = null, dataBaru = null) {
    try {
        await db.query(
            `INSERT INTO audit_trails (incident_id, user_id, aksi, data_sebelumnya, data_baru) VALUES (?, ?, ?, ?, ?)`,
            [
                incidentId, 
                userId, 
                aksi, 
                dataSebelumnya ? JSON.stringify(dataSebelumnya) : null, 
                dataBaru ? JSON.stringify(dataBaru) : null
            ]
        );
    } catch (error) {
        console.error("Gagal mencatat log audit insiden:", error.message);
    }
}

async function createIncident(req, res) {
    const { judul, deskripsi, severity_level, reporter_id } = req.body;
    
    try {
        const [userRows] = await db.query(`SELECT nama, role FROM users WHERE id = ?`, [reporter_id]);
        
        let reporterName = `User ID ${reporter_id}`;
        if (userRows.length > 0) {
            const user = userRows[0];
            reporterName = `${user.nama} (${user.role})`; 
        }

        const [result] = await db.query(
            `INSERT INTO incident_logs (judul, deskripsi, severity_level, reporter_id) 
             VALUES (?, ?, ?, ?)`,
            [judul, deskripsi, severity_level, reporter_id]
        );
        
        const newIncidentId = result.insertId;
        const logMessage = `Melaporkan insiden "${judul}" (${severity_level}) — oleh ${reporterName}.`;

        await recordAudit(
            newIncidentId, 
            reporter_id, 
            'CREATED', 
            null, 
            { message: logMessage, detail: { judul, severity_level } }
        );

        res.status(201).json({ message: 'Incident logged successfully', id: newIncidentId });
    } catch (error) {
        console.error("GAGAL SIMPAN INSIDEN:", error);
        res.status(500).json({ error: error.message });
    }
}

async function getAttentionDashboard(req, res) {
    try {
        const [rows] = await db.query(
            `SELECT incident_logs.id, incident_logs.judul, incident_logs.deskripsi, incident_logs.severity_level, incident_logs.status, incident_logs.created_at, incident_logs.reporter_id, users.nama AS reporter_name
             FROM incident_logs 
             LEFT JOIN users ON incident_logs.reporter_id = users.id
             WHERE incident_logs.is_deleted = 0
             ORDER BY 
                 CASE 
                     WHEN severity_level = 'CRITICAL' THEN 1 
                     WHEN severity_level = 'WARNING' THEN 2 
                     ELSE 3 
                 END, 
                 created_at DESC 
             LIMIT 100`
        );
        
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function softDeleteIncident(req, res) {
    const { id } = req.params;
    const user_id = req.body.user_id || (req.user ? req.user.id : null);

    try {
        const [prev] = await db.query(`SELECT status, is_deleted FROM incident_logs WHERE id = ?`, [id]);
        const dataSebelumnya = prev.length ? prev[0] : null;

        await db.query(`UPDATE incident_logs SET is_deleted = 1 WHERE id = ?`, [id]);

        await recordAudit(
            id, 
            user_id, 
            'SOFT_DELETED', 
            dataSebelumnya, 
            { message: `Incident ID ${id} dipindah ke tempat sampah.`, is_deleted: 1 }
        );

        res.json({ message: 'Incident soft deleted successfully and logged to audit trail.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function acknowledgeSingle(req, res) {
    const { id } = req.params;
    const user_id = req.body.user_id || (req.user ? req.user.id : null);

    try {
        const [prev] = await db.query(`SELECT status FROM incident_logs WHERE id = ?`, [id]);
        const dataSebelumnya = prev.length ? prev[0] : null;

        await db.query(`UPDATE incident_logs SET status = 'INVESTIGATING' WHERE id = ?`, [id]);
        
        await recordAudit(
            id, 
            user_id, 
            'ACKNOWLEDGED', 
            dataSebelumnya, 
            { message: 'Status diubah ke INVESTIGATING', status: 'INVESTIGATING' }
        );

        res.json({ message: 'Incident Acknowledged.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function acknowledgeAllCritical(req, res) {
    const user_id = req.body.user_id || (req.user ? req.user.id : null);

    try {
        const [rows] = await db.query(
            `SELECT id, status FROM incident_logs 
             WHERE severity_level = 'CRITICAL' AND status = 'OPEN' AND is_deleted = 0`
        );

        if (rows.length === 0) {
            return res.json({ message: 'Tidak ada insiden CRITICAL baru untuk di-acknowledge.' });
        }

        const ids = rows.map(r => r.id);

        await db.query(`UPDATE incident_logs SET status = 'INVESTIGATING' WHERE id IN (?)`, [ids]);

        for (const row of rows) {
            await recordAudit(
                row.id, 
                user_id, 
                'ACKNOWLEDGED', 
                { status: row.status }, 
                { message: 'Acknowledge Massal: Status diubah ke INVESTIGATING', status: 'INVESTIGATING' }
            );
        }

        res.json({ message: `${ids.length} insiden CRITICAL berhasil di-acknowledge.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function resolveIncident(req, res) {
    const { id } = req.params;
    const user_id = req.body.user_id || (req.user ? req.user.id : null);

    try {
        const [prev] = await db.query(`SELECT status FROM incident_logs WHERE id = ?`, [id]);
        const dataSebelumnya = prev.length ? prev[0] : null;

        await db.query(`UPDATE incident_logs SET status = 'RESOLVED' WHERE id = ?`, [id]);
        
        await recordAudit(
            id, 
            user_id, 
            'RESOLVED', 
            dataSebelumnya, 
            { message: 'Insiden dinyatakan selesai.', status: 'RESOLVED' }
        );

        res.json({ message: 'Incident status updated to RESOLVED.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getDeletedIncidents(req, res) {
    try {
        const [rows] = await db.query(
            `SELECT incident_logs.*, users.nama AS reporter_name 
             FROM incident_logs 
             LEFT JOIN users ON incident_logs.reporter_id = users.id
             WHERE incident_logs.is_deleted = 1 
             ORDER BY incident_logs.created_at DESC`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAuditTrails(req, res) {
    try {
        const [rows] = await db.query(
            `SELECT a.*, i.judul AS incident_title, u.nama AS actor_name 
             FROM audit_trails a
             LEFT JOIN incident_logs i ON a.incident_id = i.id
             LEFT JOIN users u ON a.user_id = u.id
             ORDER BY a.created_at DESC`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function restoreIncident(req, res) {
    const { id } = req.params;
    const user_id = req.body.user_id || (req.user ? req.user.id : null);

    try {
        const [prev] = await db.query(`SELECT is_deleted FROM incident_logs WHERE id = ?`, [id]);
        const dataSebelumnya = prev.length ? prev[0] : null;

        await db.query(`UPDATE incident_logs SET is_deleted = 0 WHERE id = ?`, [id]);

        await recordAudit(
            id, 
            user_id, 
            'RESTORED', 
            dataSebelumnya, 
            { message: 'Insiden dikembalikan dari kotak sampah ke log aktif.', is_deleted: 0 }
        );

        res.json({ message: 'Incident restored successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createIncident,
    getAttentionDashboard,
    softDeleteIncident,
    acknowledgeSingle,
    acknowledgeAllCritical,
    resolveIncident,
    getDeletedIncidents,
    getAuditTrails,
    restoreIncident
};