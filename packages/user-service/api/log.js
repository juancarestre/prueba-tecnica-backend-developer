const winston = require('winston');
const { name } = require('../package.json')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({ filename: `${name}.log` }),
    ],
});

logger.add(new winston.transports.Console({
    format: winston.format.simple(),
}));

module.exports = logger;