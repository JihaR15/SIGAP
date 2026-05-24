require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function seedUsers() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '', 
        database: process.env.DB_NAME || 'greenfields_mvp'
    });

    const saltRounds = 10;
    const passwordPlain = 'password';
    const hashedPassword = await bcrypt.hash(passwordPlain, saltRounds);

    try {
        const sql = 'INSERT IGNORE INTO users (id, nama, username, password, role) VALUES ?';
        
        const values = [
            [1, 'Manager Satu', 'manager_utama', hashedPassword, 'Manager'],
            [2, 'Staf Lapangan', 'operator01', hashedPassword, 'Operator'],
            [99, 'Sensor Node IoT', 'iot_simulator', hashedPassword, 'Operator']
        ];

        const [result] = await db.query(sql, [values]);

        if (result.affectedRows === 0) {
            console.log('✅ Data sudah ada. Tidak ada penambahan duplikat.');
        } else {
            console.log(`✅ Berhasil menyuntikkan ${result.affectedRows} akun baru! Gunakan password: password`);
        }
    } catch (error) {
        console.error('❌ Gagal memasukkan data:', error.message);
    } finally {
        await db.end();
    }
}

seedUsers();