const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = function (req, res, next) {
    const token = req.headers['x-auth-token'];

    if (!token) {
        return res.status(401).json({msg: 'No token, authorization denied.'});
    }

    try {
        const decoded = jwt.verify(token, process.env.jwtSecret);

        req.user = decoded.user;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).json({errors: [{msg: 'Token is not valid.'}]});
    }
}