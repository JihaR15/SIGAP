const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    
    if (!bearerHeader) {
        return res.status(403).json({ message: 'Akses Ditolak: Silakan login terlebih dahulu!' });
    }

    const token = bearerHeader.split(' ')[1];
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Sesi telah habis, silakan login ulang!' });
        }
        req.user = decoded; 
        next();
    });
};

exports.isManager = (req, res, next) => {
    if (req.user && req.user.role === 'Manager') {
        next(); 
    } else {
        return res.status(403).json({ message: 'Akses Ditolak: Hanya Manager yang dapat melakukan aksi ini!' });
    }
};