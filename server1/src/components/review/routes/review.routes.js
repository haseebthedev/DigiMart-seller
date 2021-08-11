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

//FOR VENDORS
router.get('/seller/store/products/reviews', auth.vendor, reviewController.getAllReviewsOfMyStore)
router.get('/seller/store/product/review/:id', auth.vendor, reviewController.getReviewById)
router.get('/seller/store/reviews/product/:id', auth.vendor, reviewController.getAllReviewsOfProductById)
router.get('/seller/store/reviews/buyer/:id', auth.vendor, reviewController.getAllReviewsOfBuyerById)
router.patch('/seller/store/product/review/:id/response', auth.vendor, reviewController.addResponseOfReviewById)

//FOR ADMINS
router.patch('/admin/product/review/:id', auth.admin, reviewController.updateReviewById)
router.delete('/admin/product/review/:id', auth.admin, reviewController.deleteReviewById)
router.get('/admin/product/review/:id', auth.admin, reviewController.getReviewById)
router.get('/admin/products/reviews/store/:id', auth.admin, reviewController.getAllReviewsOfStoreById)
router.get('/admin/store/reviews/product/:id', auth.admin, reviewController.getAllReviewsOfProductById)
router.get('/admin/store/reviews/buyer/:id', auth.admin, reviewController.getAllReviewsOfBuyerById)
router.get('/admin/stores/reviews', auth.admin, reviewController.getAllReviewsOfAllStores)

module.exports = router