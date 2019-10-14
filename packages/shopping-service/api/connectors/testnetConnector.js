const request = require('request-promise-native');


/**
 * Checks a transaction using https://testnet-api.smartbit.com.au/v1/blockchain API
 * @param {*} transactionID transaction id to be checked
 * @returns promise with results
 */
const checkTransaction = (transactionID) => { //855de8d85f1190291af8d54645ee53efe573459f5dda91c06108fcf438aa3d3
    const options = {
        method: 'GET',
        uri: `${process.env.CHAINSO}/tx/${transactionID}`,
        resolveWithFullResponse: true,
        json: true,
    };
    return request(options)
        .then((response) => response)
        .catch(e => ({error: e}));
}

module.exports = {
    checkTransaction
}