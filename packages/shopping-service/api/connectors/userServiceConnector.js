const request = require('request-promise-native');

const sendToHistory = (body, token) => { //855de8d85f1190291af8d54645ee53efe573459f5dda91c06108fcf438aa3d3
    const options = {
        method: 'POST',
        uri: `${process.env.USER_SERVICE_URL}/user/add/history`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
            'x-auth': token
        },
        body,
    };
    return request(options)
        .then((response) => response)
        .catch(e => ({error: e}));
}

module.exports = {
    sendToHistory
}