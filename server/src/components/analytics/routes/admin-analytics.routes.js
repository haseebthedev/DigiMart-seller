const express = require('express')
const router = express.Router()
const adminAnalyticsController = require('../controller/admin-analytics.controller')
const auth = require('../../users/auth')

//Analytics related to users
router.get('/admin/getTotalNumberOfBuyers', auth.admin, adminAnalyticsController.getTotalNumberOfBuyers)
router.get('/admin/getTotalNumberOfSellers', auth.admin, adminAnalyticsController.getTotalNumberOfVendors)
router.get('/admin/getAllBuyersDetails', auth.admin, adminAnalyticsController.getAllBuyersDetails)
router.get('/admin/getAllSellersDetails', auth.admin, adminAnalyticsController.getAllVendorsDetails)

//Analytics related to database
router.get('/admin/viewDatabaseUsage', auth.admin, adminAnalyticsController.viewDatabaseUsage)

module.exports = router