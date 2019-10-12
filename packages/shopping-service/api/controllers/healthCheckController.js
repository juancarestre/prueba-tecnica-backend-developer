const { name } = require('../../package.json')

const healthCheck = (req, res) => {
    res.send({
        api: name
    })
}

module.exports = {
    healthCheck
}