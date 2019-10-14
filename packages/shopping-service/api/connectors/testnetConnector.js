const request = require('request-promise-native');

const checkTransaction = (transactionID) => { //855de8d85f1190291af8d54645ee53efe573459f5dda91c06108fcf438aa3d3
    const options = {
        method: 'GET',
        uri: `${process.env.CHAINSO}/tx/${transactionID}`,
        resolveWithFullResponse: true,
        json: true,
        // body,
    };
    return request(options)
        .then((response) => response)
        .catch(e => ({error: e}));
}

module.exports = {
    checkTransaction
}