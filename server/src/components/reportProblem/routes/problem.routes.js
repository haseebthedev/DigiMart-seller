const express = require('express')
const router = express.Router()
const problemController = require('../controller/report.controller')
const auth = require('../../users/auth')

router.post('/seller/reportProblem', auth.seller, problemController.reportSellerProblem)
router.post('/buyer/reportProblem', auth.buyer, problemController.reportBuyerProblem)
router.post('/superAdmin/reportProblem', auth.superAdmin, problemController.reportSuperAdminProblem)

//ROLES FOR ADMIN
router.get('/superAdmin/view/seller/problems', auth.superAdmin, problemController.viewReportedProblemsOfSeller)
router.get('/superAdmin/view/buyer/problems', auth.superAdmin, problemController.viewReportedProblemsOfBuyer)
router.patch('/superAdmin/problem/:id', auth.superAdmin, problemController.changeProblemStatusById)

//ROLES FOR SUPER ADMIN
router.get('/superAdmin/view/system/problems', auth.superAdmin, problemController.viewReportedProblemsOfSuperAdmin)

module.exports = router