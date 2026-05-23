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

module.exports = {
    createIncident,
    getAttentionDashboard,
    softDeleteIncident
};