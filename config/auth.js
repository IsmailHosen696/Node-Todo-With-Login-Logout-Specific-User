const jwt = require('jsonwebtoken');
const User = require('../server/model/User');


// for protect routes
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECREET_TOKEN, (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
            } else {
                next();
            }
        })
    } else {
        res.redirect('/login');
    }
}

// for user glob

const currentUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECREET_TOKEN, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                const user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.redirect('/login');
    }
}

module.exports = { requireAuth, currentUser }