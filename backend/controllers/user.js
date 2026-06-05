const db = require('../config/db');
const bcrypt = require('bcrypt');

async function recordAudit(userId, aksi, dataSebelumnya = null, dataBaru = null) {
    try {
        await db.query(
            `INSERT INTO audit_trails (incident_id, user_id, aksi, data_sebelumnya, data_baru) VALUES (?, ?, ?, ?, ?)`,
            [
                null, 
                userId, 
                aksi, 
                dataSebelumnya ? JSON.stringify(dataSebelumnya) : null, 
                dataBaru ? JSON.stringify(dataBaru) : null
            ]
        );
    } catch (error) {
        console.error(error.message);
    }
}

async function getAllUsers(req, res) {
    try {
        const [rows] = await db.query(`SELECT id, nama, username, role, status FROM users`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createUser(req, res) {
    const { nama, username, password, role } = req.body;
    
    if (!nama || !username || !password || !role) {
        return res.status(400).json({ error: "Semua kolom wajib diisi" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            `INSERT INTO users (nama, username, password, role) VALUES (?, ?, ?, ?)`,
            [nama, username, hashedPassword, role]
        );

        await recordAudit(req.user.id, 'CREATE_USER', null, { nama, username, role });

        res.status(201).json({ message: "Pengguna berhasil ditambahkan" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Username sudah digunakan" });
        }
        res.status(500).json({ error: error.message });
    }
}

async function updateUser(req, res) {
    const targetUserId = parseInt(req.params.id);
    const { nama, username, role, password } = req.body;

    if (req.user.id === targetUserId) {
        return res.status(403).json({ error: "Gunakan menu Profil untuk mengedit akun Anda sendiri." });
    }

    try {
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query(
                `UPDATE users SET nama = ?, username = ?, role = ?, password = ? WHERE id = ?`,
                [nama, username, role, hashedPassword, targetUserId]
            );
        } else {
            await db.query(
                `UPDATE users SET nama = ?, username = ?, role = ? WHERE id = ?`,
                [nama, username, role, targetUserId]
            );
        }

        await recordAudit(req.user.id, 'UPDATE_USER', { id: targetUserId }, { nama, username, role });

        res.json({ message: "Pengguna berhasil diperbarui" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Username sudah digunakan oleh pengguna lain" });
        }
        res.status(500).json({ error: error.message });
    }
}

async function deleteUser(req, res) {
    const targetUserId = parseInt(req.params.id);

    if (req.user.id === targetUserId) {
        return res.status(403).json({ error: "Anda tidak dapat menonaktifkan akun Anda sendiri." });
    }

    try {
        const [prev] = await db.query(`SELECT status, nama FROM users WHERE id = ?`, [targetUserId]);
        const dataSebelumnya = prev.length ? prev[0] : null;

        await db.query(`UPDATE users SET status = 'Nonaktif' WHERE id = ?`, [targetUserId]);

        await recordAudit(
            req.user.id, 
            'DEACTIVATE_USER', 
            dataSebelumnya, 
            { message: `Akun ${dataSebelumnya?.nama} dinonaktifkan.`, status: 'Nonaktif' }
        );

        res.json({ message: "Pengguna berhasil dinonaktifkan" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateProfile(req, res) {
    const userId = req.user.id;
    const { nama, username, password } = req.body;

    try {
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query(
                `UPDATE users SET nama = ?, username = ?, password = ? WHERE id = ?`,
                [nama, username, hashedPassword, userId]
            );
        } else {
            await db.query(
                `UPDATE users SET nama = ?, username = ? WHERE id = ?`,
                [nama, username, userId]
            );
        }

        await recordAudit(userId, 'UPDATE_PROFILE', null, { nama, username });

        res.json({ message: "Profil berhasil diperbarui. Jika mengubah data penting, silakan login ulang." });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Username sudah digunakan oleh pengguna lain" });
        }
        res.status(500).json({ error: error.message });
    }
}

async function importUsers(req, res) {
    const { users } = req.body;
    
    if (!Array.isArray(users) || users.length === 0) {
        return res.status(400).json({ error: "Data pengguna kosong atau format tidak valid" });
    }

    let successCount = 0;
    let errorList = [];
    let importedData = [];

    for (let i = 0; i < users.length; i++) {
        const nama = users[i].Nama;
        const username = users[i].Username;
        const role = users[i].Peran === "Manager" ? "Manager" : "Operator";
        const rawPassword = users[i].Password;
        
        if (!nama || !username || !rawPassword) {
            errorList.push(`Baris ke-${i+1} (${nama || 'Tanpa Nama'}): Kolom wajib belum diisi.`);
            continue;
        }

        try {
            const hashedPassword = await bcrypt.hash(String(rawPassword), 10);
            await db.query(
                `INSERT INTO users (nama, username, password, role) VALUES (?, ?, ?, ?)`,
                [nama, username, hashedPassword, role]
            );
            successCount++;
            importedData.push({ nama, username, role });
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                errorList.push(`Baris ke-${i+1}: Username '${username}' sudah ada.`);
            } else {
                errorList.push(`Baris ke-${i+1}: Error sistem.`);
            }
        }
    }

    if (successCount > 0) {
        await recordAudit(req.user.id, 'IMPORT_USERS', null, { count: successCount, data: importedData });
    }

    res.json({ 
        message: `Berhasil mengimpor ${successCount} pengguna.`, 
        errors: errorList 
    });
}

async function restoreUser(req, res) {
    const targetUserId = parseInt(req.params.id);

    try {
        const [prev] = await db.query(`SELECT status, nama FROM users WHERE id = ?`, [targetUserId]);
        const dataSebelumnya = prev.length ? prev[0] : null;

        await db.query(`UPDATE users SET status = 'Aktif' WHERE id = ?`, [targetUserId]);

        await recordAudit(
            req.user.id, 
            'ACTIVATE_USER', 
            dataSebelumnya, 
            { message: `Akun ${dataSebelumnya?.nama} diaktifkan kembali.`, status: 'Aktif' }
        );

        res.json({ message: "Pengguna berhasil diaktifkan kembali" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    updateProfile,
    importUsers,
    restoreUser
};