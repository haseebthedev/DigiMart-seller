const express = require('express')
const router = express.Router()
const promoteProductController = require('../controller/promoteProduct.controller')
const auth = require('../../users/auth')

//ROUTES FOR AUTHENTICATED VENDOR
router.post('/seller/store/product/promote', auth.vendor, promoteProductController.addPromotedProduct)
//to check if same product is promoted with 7 days before promoting product
router.get('/seller/store/product/promote/:productId', auth.vendor, promoteProductController.checkIfProductPromotedBefore)
router.post('/seller/store/product/promote/schedule', auth.vendor, promoteProductController.scheduleProductPromotion)
router.get('/seller/store/products/promote/schedule', auth.vendor, promoteProductController.getScheduledPromotionsOfStore)
router.get('/seller/store/products/promote', auth.vendor, promoteProductController.getPromotedProductsOfStore)
router.patch('/seller/store/product/promote/schedule/:id', auth.vendor, promoteProductController.editScheduledPromotionById)
router.delete('/seller/store/product/promote/schedule/:id', auth.vendor, promoteProductController.deleteScheduledPromotionById)
router.get('/seller/store/product/promote/schedule/:id', auth.vendor, promoteProductController.viewScheduledPromotionById)
router.post('/seller/store/product/promotion/message', auth.vendor, promoteProductController.sendPromotionMessage)
//first make short URL then pass its data to add or schedule product promotion
router.post('/seller/store/product/url/shorten', auth.vendor, promoteProductController.generateShortURL)
//redirect route of short URL to long URL
router.get('/:code', promoteProductController.redirectToLongUrl)

//ROUTES FOR ADMIN
router.get('/admin/products/promote', auth.admin, promoteProductController.getAllPromotedProducts)

module.exports = router