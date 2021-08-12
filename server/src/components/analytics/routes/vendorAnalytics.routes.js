const express = require('express')
const router = express.Router()
const vendorAnalyticsController = require('../controller/vendorAnalytics.controller')
const auth = require('../../users/auth')

//Analytics related to vendor
router.get('/seller/store/analytics', auth.vendor, vendorAnalyticsController.getAllVendorAnalytics)

module.exports = router