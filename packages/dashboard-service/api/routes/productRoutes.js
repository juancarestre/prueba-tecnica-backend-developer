const express = require('express');
const { listProducts, buyProduct } = require('../controllers/productController')
const { authenticate } = require('../middlewares/authenticate')

const router = express.Router();

router.get('/list', listProducts)
router.get('/buy/:id/:transactionId', authenticate, buyProduct)

module.exports = router;