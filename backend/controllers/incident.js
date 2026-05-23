const db = require('../config/db');

async function createIncident(req, res) {
    const { judul, deskripsi, severity_level, reporter_id } = req.body;
    
    try {
        const [result] = await db.query(
            `INSERT INTO incident_logs (judul, deskripsi, severity_level, reporter_id) 
             VALUES (?, ?, ?, ?)`,
            [judul, deskripsi, severity_level, reporter_id]
        );
        
        const newIncidentId = result.insertId;

        await db.query(
            `INSERT INTO audit_trails (incident_id, user_id, aksi, data_baru) 
             VALUES (?, ?, ?, ?)`,
            [newIncidentId, reporter_id, 'CREATED', JSON.stringify(req.body)]
        );

        res.status(201).json({ message: 'Incident logged successfully', id: newIncidentId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAttentionDashboard(req, res) {
    try {
        const [rows] = await db.query(
            `SELECT id, judul, deskripsi, severity_level, status, created_at 
             FROM incident_logs 
             WHERE is_deleted = 0
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
    const { user_id } = req.body;

    try {
        // Soft Delete
        await db.query(
            `UPDATE incident_logs SET is_deleted = 1 WHERE id = ?`,
            [id]
        );

        await db.query(
            `INSERT INTO audit_trails (incident_id, user_id, aksi, data_baru) 
             VALUES (?, ?, ?, ?)`,
            [id, user_id || 2, 'SOFT_DELETED', JSON.stringify({ message: `Incident ID ${id} soft deleted.` })]
        );

        res.json({ message: 'Incident soft deleted successfully and logged to audit trail.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function acknowledgeSingle(req, res) {
    const { id } = req.params;
    const { user_id } = req.body;

    try {
        await db.query(`UPDATE incident_logs SET status = 'INVESTIGATING' WHERE id = ?`, [id]);
        
        await db.query(
            `INSERT INTO audit_trails (incident_id, user_id, aksi, data_baru) VALUES (?, ?, ?, ?)`,
            [id, user_id || 2, 'ACKNOWLEDGED', JSON.stringify({ message: 'Status diubah ke INVESTIGATING oleh Ops Manager' })]
        );

        res.json({ message: 'Incident Acknowledged.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function acknowledgeAllCritical(req, res) {
    const { user_id } = req.body; 

    try {
        const [rows] = await db.query(
            `SELECT id FROM incident_logs 
             WHERE severity_level = 'CRITICAL' AND status = 'OPEN' AND is_deleted = 0`
        );

        if (rows.length === 0) {
            return res.json({ message: 'Tidak ada insiden CRITICAL baru untuk di-acknowledge.' });
        }

        const ids = rows.map(r => r.id);

        await db.query(
            `UPDATE incident_logs SET status = 'INVESTIGATING' WHERE id IN (?)`,
            [ids]
        );

        for (const id of ids) {
            await db.query(
                `INSERT INTO audit_trails (incident_id, user_id, aksi, data_baru) 
                 VALUES (?, ?, ?, ?)`,
                [id, user_id || 2, 'ACKNOWLEDGED', JSON.stringify({ message: 'Status diubah ke INVESTIGATING oleh Ops Manager' })]
            );
        }

        res.json({ message: `${ids.length} insiden CRITICAL berhasil di-acknowledge.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function resolveIncident(req, res) {
    const { id } = req.params;
    const { user_id } = req.body;
    try {
        await db.query(`UPDATE incident_logs SET status = 'RESOLVED' WHERE id = ?`, [id]);
        
        await db.query(
            `INSERT INTO audit_trails (incident_id, user_id, aksi, data_baru) VALUES (?, ?, ?, ?)`,
            [id, user_id || 2, 'RESOLVED', JSON.stringify({ message: 'Insiden dinyatakan selesai (RESOLVED).' })]
        );
        res.json({ message: 'Incident status updated to RESOLVED.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getDeletedIncidents(req, res) {
    try {
        const [rows] = await db.query(
            `SELECT id, judul, deskripsi, severity_level, status, created_at FROM incident_logs WHERE is_deleted = 1 ORDER BY created_at DESC`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAuditTrails(req, res) {
    try {
        const [rows] = await db.query(
            `SELECT a.id, a.aksi, a.data_baru, a.created_at, i.judul as incident_title 
             FROM audit_trails a
             LEFT JOIN incident_logs i ON a.incident_id = i.id
             ORDER BY a.created_at DESC`
        );
        res.json(rows);
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
    getAuditTrails
};