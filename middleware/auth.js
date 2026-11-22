const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const getToken = (req) => {
    const authorization = req.header('Authorization');
    if (authorization) {
        return authorization.replace(/^Bearer\s+/i, '');
    }

    const cookie = req.headers.cookie
        ?.split(';')
        .map((item) => item.trim())
        .find((item) => item.startsWith('amp_token='));

    return cookie ? decodeURIComponent(cookie.slice('amp_token='.length)) : null;
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

exports.authenticate = (req, res, next) => {
    const token = getToken(req);

    if (!token) return res.redirect('/login');

    try {
        const verified = verifyToken(token);
        req.user = verified;
        next();
    } catch (err) {
        return res.redirect('/login');
    }
}

exports.loadCurrentUser = async (req, res, next) => {
    const token = getToken(req);

    if (!token) {
        res.locals.currentUser = null;
        return next();
    }

    try {
        const verified = verifyToken(token);
        const user = await User.findById(verified.id).select('username profilePicture role');

        if (!user) {
            res.clearCookie('amp_token');
            res.locals.currentUser = null;
            return next();
        }

        req.user = user;
        res.locals.currentUser = user;
        next();
    } catch (err) {
        res.clearCookie('amp_token');
        res.locals.currentUser = null;
        next();
    }
};

exports.authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).render('error', { code: '403', message: 'Access denied' });
        }
        next();
    };
};

exports.getToken = getToken;
exports.verifyToken = verifyToken;