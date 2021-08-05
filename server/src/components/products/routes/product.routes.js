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
router.patch('/admin/product/block/:id', auth.admin, productController.blockProduct)
router.patch('/admin/product/unblock/:id', auth.admin, productController.unblockProduct)
router.get('/admin/products/totalNumber', auth.admin, productController.getTotalNumberOfProducts)
router.patch('/admin/product/:id', auth.admin, productController.editProductById)
router.delete('/admin/product/:id', auth.admin, productController.deleteProductById)
router.post('/admin/product/store/:id', auth.admin, productController.addProductByStoreId)

//GENERAL ROUTES FOR VENDOR, ADMIN, BUYER

module.exports = router