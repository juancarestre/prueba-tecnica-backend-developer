const request = require('request-promise-native');

/**
 *  Saves products bought history send HTTP post request to user-service
 *  Executed after a transactions is finished
 * @param {*} body Body of the history, has information about the product that was purchased
 * @param {*} userToken Token to get authenticated
 * @returns promise with results
 */
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