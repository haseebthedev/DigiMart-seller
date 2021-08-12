const express = require('express')
const router = express.Router()
const adminAnalyticsController = require('../controller/adminAnalytics.controller')
const auth = require('../../users/auth')

//Analytics related to database
router.get('/admin/database/details', auth.admin, adminAnalyticsController.viewDatabaseUsage)

module.exports = router