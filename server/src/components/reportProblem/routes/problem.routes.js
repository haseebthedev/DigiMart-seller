const express = require('express')
const router = express.Router()
const problemController = require('../controller/report.controller')
const auth = require('../../users/auth')

router.post('/seller/reportProblem', auth.vendor, problemController.reportVendorProblem)
router.post('/buyer/reportProblem', auth.buyer, problemController.reportBuyerProblem)
router.post('/admin/reportProblem', auth.admin, problemController.reportAdminProblem)

module.exports = router