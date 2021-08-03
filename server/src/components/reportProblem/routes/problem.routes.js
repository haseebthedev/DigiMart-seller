const express = require('express')
const router = express.Router()
const problemController = require('../controller/report.controller')
const auth = require('../../users/auth')

router.post('/seller/reportProblem', auth.vendor, problemController.reportVendorProblem)
router.post('/buyer/reportProblem', auth.buyer, problemController.reportBuyerProblem)
router.post('/admin/reportProblem', auth.admin, problemController.reportAdminProblem)

//ROLES FOR ADMIN
router.get('/admin/view/seller/problems', auth.admin, problemController.viewReportedProblemsOfVendor)
router.get('/admin/view/buyer/problems', auth.admin, problemController.viewReportedProblemsOfBuyer)
router.patch('/admin/problem/:id', auth.admin, problemController.changeProblemStatusById)

//ROLES FOR SUPER ADMIN
router.get('/superAdmin/view/admin/problems', auth.admin, problemController.viewReportedProblemsOfAdmin)

module.exports = router