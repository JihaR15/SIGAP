const db = require('../config/db');

async function getAllUsers(req, res) {
    try {
        const [rows] = await db.query(`SELECT id, nama, role FROM users`);
        
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllUsers
};