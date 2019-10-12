const express = require('express');
const { healthCheck } = require('../controllers/healthCheckController.js')

const router = express.Router();

router.get('/', healthCheck)

module.exports = router;
