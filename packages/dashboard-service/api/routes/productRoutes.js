const express = require('express');
const { healthCheck } = require('../controllers/healthCheckController.js')

const router = express.Router();

router.get('/list', healthCheck)

module.exports = router;