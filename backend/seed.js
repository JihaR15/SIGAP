const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function seedUsers() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'admin_web',
        password: '101104', 
        database: 'greenfields_mvp'
    });

    const saltRounds = 10;
    const passwordPlain = 'password';
    const hashedPassword = await bcrypt.hash(passwordPlain, saltRounds);

    try {
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');

        await db.execute('TRUNCATE TABLE users');

        await db.execute('SET FOREIGN_KEY_CHECKS = 1');

        await db.execute(
            'INSERT INTO users (nama, username, password, role) VALUES (?, ?, ?, ?)',
            ['Manager Satu', 'manager_utama', hashedPassword, 'Manager']
        );

        await db.execute(
            'INSERT INTO users (nama, username, password, role) VALUES (?, ?, ?, ?)',
            ['Staf Lapangan', 'operator01', hashedPassword, 'Operator']
        );
        
        console.log('✅ Berhasil menyuntikkan akun! Gunakan password: password');
    } catch (error) {
        console.error('❌ Gagal memasukkan data:', error.message);
    } finally {
        await db.end();
    }
}

seedUsers();