const express = require('express')
const router = express.Router()
const adminAnalyticsController = require('../controller/adminAnalytics.controller')
const sellerAnalyticsController = require('../controller/sellerAnalytics.controller')
const auth = require('../../users/auth')

//SELLER ANALYTICS
router.get('/seller/store/analytics', auth.seller, sellerAnalyticsController.getAllSellerAnalytics)

//ADMIN ANALYTICS
//Analytics related to all the system
router.get('/superAdmin/system/analytics', auth.superAdmin, adminAnalyticsController.getAllSystemAnalytics)
//Analytics of store
router.get('/superAdmin/store/:id/analytics', auth.superAdmin, sellerAnalyticsController.getAllSellerAnalytics)

module.exports = router