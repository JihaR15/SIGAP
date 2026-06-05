const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ?";

    const [users] = await db.query(sql, [username]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Username tidak ditemukan!" });
    }

    const user = users[0];

    if (user.status === 'Nonaktif') {
      return res.status(403).json({ message: "Akun Anda telah dinonaktifkan. Silakan hubungi Administrator." });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Password salah!" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.json({
      id: user.id,
      message: "Login berhasil",
      token,
      role: user.role,
      nama: user.nama,
      username: user.username
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan internal server" });
  }
};
