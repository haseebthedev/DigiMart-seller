const express = require('express')
const router = express.Router()
const orderController = require('../controller/order.controller')
const auth = require('../../users/auth')

//ROUTES FOR BUYER
router.post('/buyer/product/order', orderController.addOrder)

//ROUTES FOR AUTHENTICATED VENDOR
router.patch('/seller/store/order/:id', auth.seller, orderController.updateOrderById)
router.delete('/seller/store/order/:id', auth.seller, orderController.deleteOrderById)
router.get('/seller/store/order/:id', auth.seller, orderController.getOrderDetailsById)
router.get('/seller/store/orders/view', auth.seller, orderController.getAllOrdersOfMyStore)
router.get('/seller/store/orders/:status', auth.seller, orderController.getOrdersOfMyStoreByStatus)
router.patch('/seller/store/order/product/:id', auth.seller, orderController.updateOrderedProductById)
router.delete('/seller/store/order/product/:id', auth.seller, orderController.deleteOrderedProductById)
router.get('/seller/store/orders/date/range', auth.seller, orderController.getOrdersListBetweenDateRange)
router.get('/seller/store/buyers', auth.seller, orderController.getAllCustomersOfStoreAndCountOfTheirOrders)

//ROUTES FOR ADMIN
//crud operations
router.get('/superAdmin/store/order/:id', auth.superAdmin, orderController.getOrderDetailsById)
router.patch('/superAdmin/store/order/:id', auth.superAdmin, orderController.updateOrderById)
router.delete('/superAdmin/store/order/:id', auth.superAdmin, orderController.deleteOrderById)
router.patch('/superAdmin/store/order/product/:id', auth.superAdmin, orderController.updateOrderedProductById)
router.delete('/superAdmin/store/order/product/:id', auth.superAdmin, orderController.deleteOrderedProductById)
//all get requests
router.get('/superAdmin/orders/store/:id', auth.superAdmin, orderController.getAllOrdersOfStoreById)
router.get('/superAdmin/orders/pending/store/:id', auth.superAdmin, orderController.getPendingOrdersOfStoreById)
router.get('/superAdmin/orders/cancelled/store/:id', auth.superAdmin, orderController.getCancelledOrdersOfStoreById)
router.get('/superAdmin/orders/active/store/:id', auth.superAdmin, orderController.getActiveOrdersOfStoreById)
router.get('/superAdmin/orders/returned/store/:id', auth.superAdmin, orderController.getReturnedOrdersOfStoreById)
router.get('/superAdmin/orders/completed/store/:id', auth.superAdmin, orderController.getCompletedOrdersOfStoreById)
router.get('/superAdmin/orders/stores', auth.superAdmin, orderController.getAllOrdersInAllStores)
router.get('/superAdmin/store/:id/orders/date/range', auth.superAdmin, orderController.getOrdersListBetweenDateRange)
router.get('/superAdmin/store/:id/buyers', auth.superAdmin, orderController.getAllCustomersOfStoreAndCountOfTheirOrdersByStoreId)

//ANALYTICS FOR SELLER
router.get('/seller/store/orders/sale/count', auth.seller, orderController.countTotalSalesOfStore)
router.get('/seller/store/orders/count/:status', auth.seller, orderController.countMyStoreOrderssByStatus)
router.get('/admin/store/orders/today/count', auth.seller, orderController.countMyStoreOrdersDeliveredToday)
router.get('/admin/store/orders/revenue', auth.seller, orderController.totalRevenueEarnedByMyStore)
router.get('/admin/store/orders/profit', auth.seller, orderController.totalProfitEarnedByMyStore)

module.exports = router