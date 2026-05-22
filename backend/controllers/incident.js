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

// Mengambil data untuk Dashboard (Attention Logic)
async function getAttentionDashboard(req, res) {
    try {
        const [rows] = await db.query(
            `SELECT 
                id, judul, severity_level, status, created_at 
             FROM incident_logs 
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

module.exports = {
    createIncident,
    getAttentionDashboard
};