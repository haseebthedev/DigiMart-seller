const express = require('express')
const router = express.Router()
const promoteProductController = require('../controller/promoteProduct.controller')
const auth = require('../../users/auth')

//ROUTES FOR AUTHENTICATED SELLLER
router.post('/seller/store/product/promote', auth.seller, promoteProductController.addPromotedProduct)
//to check if same product is promoted with 7 days before promoting product
router.get('/seller/store/product/promote/:productId', auth.seller, promoteProductController.checkIfProductPromotedBefore)
router.post('/seller/store/product/promote/schedule', auth.seller, promoteProductController.scheduleProductPromotion)
router.get('/seller/store/products/promote/schedule', auth.seller, promoteProductController.getScheduledPromotionsOfStore)
router.get('/seller/store/products/promote', auth.seller, promoteProductController.getPromotedProductsOfStore)
router.patch('/seller/store/product/promote/schedule/:id', auth.seller, promoteProductController.editScheduledPromotionById)
router.delete('/seller/store/product/promote/schedule/:id', auth.seller, promoteProductController.deleteScheduledPromotionById)
router.get('/seller/store/product/promote/schedule/:id', auth.seller, promoteProductController.viewScheduledPromotionById)
router.post('/seller/store/product/promotion/message', auth.seller, promoteProductController.sendPromotionMessage)
//first make short URL then pass its data to add or schedule product promotion
router.post('/seller/store/product/url/shorten', auth.seller, promoteProductController.generateShortURL)
//redirect route of short URL to long URL
router.get('/:code', promoteProductController.redirectToLongUrl)

//ROUTES FOR ADMIN
router.get('/superAdmin/products/promote', auth.superAdmin, promoteProductController.getAllPromotedProducts)

module.exports = router