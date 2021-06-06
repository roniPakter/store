const jwt = require('jsonwebtoken');
const cofig = require('config');

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    
    if (!token) {
        res.status(401).json({ msg: "authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'token is not valid' });
    }
}