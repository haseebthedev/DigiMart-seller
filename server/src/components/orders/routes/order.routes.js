const express = require('express')
const router = express.Router()
const orderController = require('../controller/order.controller')
const auth = require('../../users/auth')

//ROUTES FOR BUYER
router.post('/buyer/product/order', orderController.addOrder)

//ROUTES FOR AUTHENTICATED VENDOR
router.patch('/seller/store/order/:id', auth.vendor, orderController.updateOrderById)
router.delete('/seller/store/order/:id', auth.vendor, orderController.deleteOrderById)
router.get('/seller/store/order/:id', auth.vendor, orderController.getOrderDetailsById)
router.get('/seller/store/orders/view', auth.vendor, orderController.getAllOrdersOfMyStore)
router.get('/seller/store/orders/:status', auth.vendor, orderController.getOrdersOfMyStoreByStatus)

//ROUTES FOR ADMIN
//crud operations
router.get('/admin/store/order/:id', auth.admin, orderController.getOrderDetailsById)
router.patch('/admin/store/order/:id', auth.admin, orderController.updateOrderById)
router.delete('/admin/store/order/:id', auth.admin, orderController.deleteOrderById)
//all get requests
router.get('/admin/orders/store/:id', auth.admin, orderController.getAllOrdersOfStoreById)
router.get('/admin/orders/pending/store/:id', auth.admin, orderController.getPendingOrdersOfStoreById)
router.get('/admin/orders/cancelled/store/:id', auth.admin, orderController.getCancelledOrdersOfStoreById)
router.get('/admin/orders/active/store/:id', auth.admin, orderController.getActiveOrdersOfStoreById)
router.get('/admin/orders/returned/store/:id', auth.admin, orderController.getReturnedOrdersOfStoreById)
router.get('/admin/orders/completed/store/:id', auth.admin, orderController.getCompletedOrdersOfStoreById)
router.get('/admin/orders/stores', auth.admin, orderController.getAllOrdersInAllStores)

//ANALYTICS FOR VENDOR
router.get('/seller/store/sales/count', auth.vendor, orderController.countTotalSalesOfStore)

module.exports = router