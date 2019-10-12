const { User } = require('../models/userModel');
const isHex = require('validator/lib/isHexadecimal');
const logger = require('../log');

const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject('Not authenticated');
        }

        req.user = user;
        req.token = token;
        req.access = user.tokens.slice(-1)[0].access;
        logger.info(`${user.email} ${req.method} ${req.url}`);


        next();
    }).catch((e) => {
        res.status(401).send(e);
    });
};


module.exports = { authenticate };
