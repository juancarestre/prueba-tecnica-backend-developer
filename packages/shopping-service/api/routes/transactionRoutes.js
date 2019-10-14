const express = require('express');
const { newTransaction, checkTransactionController } = require('../controllers/transactionController')
const { authenticate } = require('../middlewares/authenticate')

const router = express.Router();

router.post('/new', authenticate, newTransaction)
router.get('/check/:transactionId', authenticate, checkTransactionController)


module.exports = router;