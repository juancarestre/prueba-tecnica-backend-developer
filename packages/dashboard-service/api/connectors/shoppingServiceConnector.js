const request = require('request-promise-native');

/**
 *  Executed after buying a product
 *  Starts a transaction process sending a post request to the shopping-service
 * @param {*} body Body of the transaction, has information about the product that will be purchased and the user who buys it
 * @param {*} userToken Token to get authenticated
 * @returns promise with results
 */
const sendTransaction = (body, userToken) => {
    
    const options = {
        method: 'POST',
        uri: `${process.env.SHOPPING_SERVICE}/transaction/new`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
            'x-auth': userToken
        },
        body,
    };
    return request(options)
        .then((response) => response)
        .catch(e => ({error: e}));
}

module.exports = {
    sendTransaction
}