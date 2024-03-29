const express = require('express');
const {
    healthCheck
} = require('../controllers/healthCheckController.js')
const userController = require('../controllers/userController.js')
const {
    authenticate
} = require('../middlewares/authenticate')

const router = express.Router();

router.post('/create', userController.createUser)
router.post('/login', userController.loginUser)
router.get('/me', authenticate, userController.getUser)
router.get('/me/cart', authenticate, userController.myCart)
router.get('/me/favorite', authenticate, userController.myFavorite)
router.get('/me/history', authenticate, userController.myHistory)
router.post('/add/cart', authenticate, userController.addToCart)
router.post('/add/favorite', authenticate, userController.addToFavorites)
router.post('/add/history', authenticate, userController.addToHistory)



module.exports = router;