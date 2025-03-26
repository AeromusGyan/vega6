const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'NERITICS';

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({message: 'Access Denied: No Token Provided'});
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({status: 403, message: 'Invalid Token, Please Login again!'});
    }
};


module.exports = {
    verifyToken
};
