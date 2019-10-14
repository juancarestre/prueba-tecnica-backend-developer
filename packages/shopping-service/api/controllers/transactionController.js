const cron = require("node-cron");
const logger = require('../log');
const {
    checkTransaction
} = require('../connectors/testnetConnector')

const {
    sendToHistory
} = require('../connectors/userServiceConnector')

const {
    Transaction
} = require('../models/transactionModel')
const {
    sendEmail
} = require('../utils/mailer')

/**
 * parse Transaction body in the transaction Schema body
 * @param {*} req HTTP request
 * @returns parsed transaction
 */
const incommingTransactionB = (req) => ({
    user__id: req.body.user._id,
    user_name: req.body.user.name,
    user_email: req.body.user.email,
    product__id: req.body.product._id,
    product_name: req.body.product.name,
    product_price: req.body.product.price,
    product_addressToBuy: req.body.product.addressToBuy,
    transactionId: req.body.transactionId
})

/**
 *
 * confirms a transaction, changing the confirmed flag and message status,
 * if the transaction was correct, sendToHistory sends an HTTP request to 
 * the user-service in order to add the history to the products history inside the user schema
 * also calls sendemail to send an confirmation email to the customer 
 * @param {*} transaction transaction object created
 * @param {*} message confirmation or invalidation message to be added to the transaction schema
 * @param {*} confirmed Boolean flag
 * @param {*} token token to be authenticated
 */
const confirmTransaction = (transaction, message, confirmed, token) => {
    Transaction.findOneAndUpdate({
        _id: transaction._id,
    }, {
        $set: {
            confirmed,
            message
        }
    }, {
        confirmed: confirmed,
        message
    }).then((objectUpdated) => {
        if (!objectUpdated) {
            logger.info('error');
        }

        if (confirmed && objectUpdated) {
            sendToHistory({
                    name: transaction.product_name,
                    price: transaction.product_price,
                    productObjectID: transaction.product__id,
                }, token)
                .then(result => logger.info(`sended to buy history: ${result.statusCode}`))
                .catch(e => logger.info(e))
            sendemail(transaction.user_email, transaction.user_name, transaction.product_name, transaction.transactionId)            
        }

        logger.info(`TRANSACTION UPDATED ${transaction._id}`);
    });


}
/**
 * creates a new transaction object, if the transaction object is created, this method activates a cron job
 * cron job checks the transaction status using checkTransaction connector (ussing the API) 
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 */
const newTransaction = (req, res) => {
    
    const incommingTransaction = incommingTransactionB(req)
    const transaction = new Transaction(incommingTransaction)

    transaction.save().then(objectCreated => {
        res.send({
            message: 'TransactionWillBeCheckedAutomaticallyEveryMinut',
            created: objectCreated
        })

        let time = 0
        let mycron = cron.schedule("* * * * *", function () {
            logger.info(`${time}# - Checking for user:${req.user.email} - transaction mongoID:${objectCreated._id} networkID: ${objectCreated.transactionId}`)
            let message = ''
            time++
            checkTransaction(incommingTransaction.transactionId).then(result => {
                // console.log(JSON.stringify(result, null, 2))

                // TRANSACTION IS NOT VALID, the api cant be reached, maybe the transactionId was not correct
                if (result.error) {
                    message = `TRANSACTION IS NOT VALID: ${result.error.message}`
                    logger.info(message)
                    mycron.stop()
                    confirmTransaction(objectCreated, message, false)
                    return
                }

                let transactionIsValid = false

                result.body.transaction.outputs.
                forEach(output => {
                    if (output.addresses.find(address => address === incommingTransaction.product_addressToBuy)) transactionIsValid = true
                })

                // TRANSACTION IS NOT VALID, WIF doesnt is the WIF in the product schema
                if (!transactionIsValid) {
                    message = `TRANSACTION IS NOT VALID, ADDRESS DOESNT MATCH WITH: ${incommingTransaction.product_addressToBuy}`
                    logger.info(message)
                    mycron.stop()
                    confirmTransaction(objectCreated, message, false)
                    return
                }

                // TRANSACTION IS NOT VALID, input_amount < product_price
                if (result.body.transaction.input_amount < incommingTransaction.product_price) {
                    message = `TRANSACTION IS NOT VALID: input_amount (${result.body.transaction.input_amount}) < product_price (${incommingTransaction.product_price})`
                    logger.info(message)
                    mycron.stop()
                    confirmTransaction(objectCreated, message, false)
                    return
                }

                // TRANSACTION IS VALID, has at least 1 confirmation
                if (result.body.transaction.confirmations) {
                    message = `CONFIRMED TRANSACTION`
                    logger.info(message)
                    mycron.stop()
                    confirmTransaction(objectCreated, message, true, req.token)
                } else {
                    logger.info(`NOT CONFIRMED YET`)
                }

            }).catch(e => {
                logger.error(e)
            })
            if (time > 90) mycron.stop()
        });

    }).catch(e => {
        let message = `TRANSACTION IS NOT VALID, THAT TRANSACTION ID WAS ALREADY USED: ${incommingTransaction.transactionId}`
        logger.info(message)
        res.send({
            message,
            error: e
        })
    });

}

/**
 * Checks the status of an transaction using transactionID
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 */
const checkTransactionController = (req, res) => {
    
    Transaction.findOne({
        transactionId: req.params.transactionId,
    }).then((object) => {
        if (!object) {
            throw Error('Object not found');
        }
        res.send(object)
    }).catch(e => {
        res.send({
            message: e
        })
    });
}

/**
 * Sends confirmation Email
 * @param {*} to
 * @param {*} userName
 * @param {*} productName
 * @param {*} transactionId
 */
const sendemail = (to, userName, productName , transactionId) => {
    
    let template = './api/public/mailer/Login.html'

    rigoPhrases = ['loves you', 'hates you', 'wants to kill you', 'want to kiss you']

    const replacements = {
        rigoWants: `rigo ${rigoPhrases[Math.floor(Math.random() * rigoPhrases.length)]}`,
        urlData: `https://live.blockcypher.com/btc-testnet/tx/${transactionId}/`,
        productName,
        userName
    };

    sendEmail(
        to,
        "Ty for test my application",
        template,
        replacements
    ).then(resInfo =>
        !resInfo ?
        logger.info('Error sending email') :
        logger.info(`Send email ${resInfo.response}`)
    ).catch(e => {
        logger.info(`Error sendemail ${e}`)
    })
}

module.exports = {
    newTransaction,
    checkTransactionController
}