const express = require('express')
const router = express.Router()
const adminAnalyticsController = require('../controller/adminAnalytics.controller')
const sellerAnalyticsController = require('../controller/sellerAnalytics.controller')
const auth = require('../../users/auth')

//SELLER ANALYTICS
router.get('/seller/store/analytics', auth.seller, sellerAnalyticsController.getAllSellerAnalytics)

//ADMIN ANALYTICS
//Analytics related to database
router.get('/superAdmin/database/details', auth.superAdmin, adminAnalyticsController.viewDatabaseUsage)

module.exports = router