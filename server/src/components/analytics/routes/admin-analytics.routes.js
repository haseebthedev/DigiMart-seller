const express = require('express')
const router = express.Router()
const adminAnalyticsController = require('../controller/admin-analytics.controller')
const auth = require('../../users/auth')

//Analytics related to database
router.get('/admin/viewDatabaseUsage', auth.admin, adminAnalyticsController.viewDatabaseUsage)

module.exports = router