const { Product } = require('../models/productModel')
const { CRUDProducts } = require('./CRUD')
const { productsSeed } = require('../utils/products.seed')
const { sendTransaction } = require('../connectors/shoppingServiceConnector')

const productCrud = new CRUDProducts(Product)

const initializeProducts = () => {
    productCrud.deleteAll()
    productsSeed.forEach(product => {
        product.addressToBuy = process.env.MY_WALLET_ADDRESS
        productCrud.create({ body: product })
    })
}
const listProducts = (req, res) => {
    productCrud.read(req).then(result => {
        res.send(result)
    }).catch(e => res.send(500))
}

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