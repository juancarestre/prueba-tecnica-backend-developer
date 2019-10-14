const { name } = require('../../package.json')

/**
 * healtCheck
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 */
const healthCheck = (req, res) => {
    
    res.send({
        api: name
    })
}

module.exports = {
    healthCheck
}