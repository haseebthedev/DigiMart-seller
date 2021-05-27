const express = require('express')
const router = express.Router()
const productController = require('../controller/product.controller')
const auth = require('../../users/auth')

//ROUTES FOR AUTHENTICATED VENDOR
router.post('/seller/store/product', auth.vendor, productController.addProduct)
router.patch('/seller/store/product/:id', auth.vendor, productController.updateProduct)
router.delete('/seller/store/product/:id', auth.vendor, productController.deleteProduct)
router.get('/seller/store/products', auth.vendor, productController.viewMyStoreProducts)
router.get('/seller/store/product/:id', auth.vendor, productController.viewMyStoreProduct)

//ROUTES FOR ADMIN
router.get('/admin/products', auth.admin , productController.viewAllProductsInAllStores)
router.get('/admin/product/:id', auth.admin, productController.viewProductDetails)
router.get('/admin/products/store/:id', auth.admin, productController.viewProductsOfStore)

//GENERAL ROUTES FOR VENDOR, ADMIN, BUYER

module.exports = router