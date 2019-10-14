const { Product } = require('../models/productModel')
const { CRUDProducts } = require('./CRUD')
const { productsSeed } = require('../utils/products.seed')
const { sendTransaction } = require('../connectors/shoppingServiceConnector')

const productCrud = new CRUDProducts(Product)

/**
 * initialize products inside mongoDB using a seed,
 * the products always has the same id.
 */
const initializeProducts = () => {
    productCrud.deleteAll()
    productsSeed.forEach(product => {
        product.addressToBuy = process.env.MY_WALLET_ADDRESS
        productCrud.create({ body: product })
    })
}

/**
 * List the available products that can be purchased
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 */
const listProducts = (req, res) => {
    productCrud.read(req).then(result => {
        res.send(result)
    }).catch(e => res.send(500))
}

/**
 *
 * buys a product, the http reqs receives as params /:id/:transactionID
 * :id is the product id that will be purchased
 * :transactionID It is the identifier of the transaction with which it will be verified that the payment was made
 * 
 * first check that the product id exists
 * second create transaction body with user, transactionId and product information
 * send transaction to the shopping-service
 * shopping-services verifies that the transaction was correct with respect to the payment, the objective wallet and the confirmation of the transaction
 * 
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 */
const buyProduct = (req, res) => {
    productCrud.read(req).then(product => {
        if (!product._id) {
            res.send(product)
            return
        }
        const transaction = {
            user: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
            },
            product,
            transactionId: req.params.transactionId
        }
        sendTransaction(transaction, req.token).then(result => {
            res.send(result)
        }).catch(e => res.send({ error: e }))
    }).catch(e => res.send(500))
}

module.exports = {
    initializeProducts,
    listProducts,
    buyProduct
}