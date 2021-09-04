const express = require('express')
const router = express.Router()
const orderReportController = require('../controller/orderReport.controller')
const auth = require('../../users/auth')

//for buyer
router.post('/buyer/problem/report/order', auth.buyer, orderReportController.reportOrderProblem)

//for seller
router.patch('/seller/order/problem/:id', auth.seller, orderReportController.updateOrderProblemById)
router.get('/seller/problem/order/:id', auth.seller, orderReportController.viewOrderProblemByOrderId)
router.get('/seller/problem/orders', auth.seller, orderReportController.viewAllOrdersProblemsOfStoreByID)

//for admin
router.get('/superAdmin/stores/problems/orders', auth.superAdmin, orderReportController.viewAllOrderProblemsOfAllStores)
router.get('/superAdmin/store/:id/problems/orders', auth.superAdmin, orderReportController.viewAllOrdersProblemsOfStoreByID)
router.patch('/superAdmin/order/problem/:id', auth.superAdmin, orderReportController.updateOrderProblemById)
router.delete('/superAdmin/order/problem/:id', auth.superAdmin, orderReportController.deleteOrderProblemById)
router.get('/superAdmin/problem/order/:id', auth.superAdmin, orderReportController.viewOrderProblemByOrderId)

//ORDER REPORT SUBJECTS
//for admin
router.post('/superAdmin/order/problem/subject', auth.superAdmin, orderReportController.addOrderReportSubject)
router.patch('/superAdmin/order/problem/subject/:id', auth.superAdmin, orderReportController.updateOrderReportSubject)
router.delete('/superAdmin/order/problem/subject/:id', auth.superAdmin, orderReportController.deleteOrderReportSubject)
router.get('/superAdmin/order/problem/subject/:id', auth.superAdmin, orderReportController.getOrderReportSubjectById)
router.get('/superAdmin/order/problem/subjects', auth.superAdmin, orderReportController.getAllOrderReportSubjects)

//for buyer
router.get('/buyer/order/problem/subject/:id', auth.buyer, orderReportController.getOrderReportSubjectById)
router.get('/buyer/order/problem/subjects', auth.buyer, orderReportController.getAllOrderReportSubjects)

module.exports = router