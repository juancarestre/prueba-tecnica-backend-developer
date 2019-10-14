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

                if (!transactionIsValid) {
                    message = `TRANSACTION IS NOT VALID, ADDRESS DOESNT MATCH WITH: ${incommingTransaction.product_addressToBuy}`
                    logger.info(message)
                    mycron.stop()
                    confirmTransaction(objectCreated, message, false)
                    return
                }

                if (result.body.transaction.input_amount < incommingTransaction.product_price) {
                    message = `TRANSACTION IS NOT VALID: input_amount (${result.body.transaction.input_amount}) < product_price (${incommingTransaction.product_price})`
                    logger.info(message)
                    mycron.stop()
                    confirmTransaction(objectCreated, message, false)
                    return
                }

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