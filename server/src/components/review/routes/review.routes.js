const express = require('express')
const router = express.Router()
const reviewController = require('../controller/review.controller')
const auth = require('../../users/auth')

//FOR BUYERS
router.post('/buyer/product/review', auth.buyer, reviewController.addReview)
router.patch('/buyer/product/review/:id', auth.buyer, reviewController.updateReviewById)
router.delete('/buyer/product/review/:id', auth.buyer, reviewController.deleteReviewById)
router.get('/buyer/product/review/:id', auth.buyer, reviewController.getReviewById)
router.get('/buyer/reviews/view', auth.buyer, reviewController.getAllReviewsGivenByMe)
router.get('/buyer/reviews/product/:id', reviewController.getAllReviewsOfProductById)

//FOR VENDORS
router.get('/seller/store/products/reviews', auth.seller, reviewController.getAllReviewsOfMyStore)
router.get('/seller/store/product/review/:id', auth.seller, reviewController.getReviewById)
router.get('/seller/store/reviews/product/:id', auth.seller, reviewController.getAllReviewsOfProductById)
router.get('/seller/store/reviews/buyer/:id', auth.seller, reviewController.getAllReviewsOfBuyerById)
router.patch('/seller/store/product/review/:id/response', auth.seller, reviewController.addResponseOfReviewById)

//FOR ADMINS
router.patch('/superAdmin/product/review/:id', auth.superAdmin, reviewController.updateReviewById)
router.delete('/superAdmin/product/review/:id', auth.superAdmin, reviewController.deleteReviewById)
router.get('/superAdmin/product/review/:id', auth.superAdmin, reviewController.getReviewById)
router.get('/superAdmin/products/reviews/store/:id', auth.superAdmin, reviewController.getAllReviewsOfStoreById)
router.get('/superAdmin/store/reviews/product/:id', auth.superAdmin, reviewController.getAllReviewsOfProductById)
router.get('/superAdmin/store/reviews/buyer/:id', auth.superAdmin, reviewController.getAllReviewsOfBuyerById)
router.get('/superAdmin/stores/reviews', auth.superAdmin, reviewController.getAllReviewsOfAllStores)

module.exports = router