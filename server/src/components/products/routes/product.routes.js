const express = require('express')
const router = express.Router()
const productController = require('../controller/product.controller')
const auth = require('../../users/auth')

//ROUTES FOR AUTHENTICATED SELLER
router.post('/seller/store/product', auth.seller, productController.addProductToMyStore)
router.patch('/seller/store/product/:id', auth.seller, productController.updateProduct)
router.delete('/seller/store/product/:id', auth.seller, productController.deleteProduct)
router.get('/seller/store/products', auth.seller, productController.viewMyStoreProducts)
router.get('/seller/store/product/:id', auth.seller, productController.viewMyStoreProduct)
//Analytics
router.get('/seller/store/products/stock/count', auth.seller, productController.countMyStoreProductsStock)
router.get('/seller/store/products/expense', auth.seller, productController.countTotalExpenseOfProducts)

//ROUTES FOR ADMIN
router.get('/superAdmin/products', auth.superAdmin , productController.viewAllProductsInAllStores)
router.get('/superAdmin/product/:id', auth.superAdmin, productController.viewProductDetails)
router.get('/superAdmin/products/store/:id', auth.superAdmin, productController.viewProductsOfStore)
router.patch('/superAdmin/product/block/:id', auth.superAdmin, productController.blockProduct)
router.patch('/superAdmin/product/unblock/:id', auth.superAdmin, productController.unblockProduct)
router.get('/superAdmin/products/totalNumber', auth.superAdmin, productController.getTotalNumberOfProducts)
router.patch('/superAdmin/product/:id', auth.superAdmin, productController.editProductById)
router.delete('/superAdmin/product/:id', auth.superAdmin, productController.deleteProductById)
router.post('/superAdmin/product/store/:id', auth.superAdmin, productController.addProductByStoreId)

//GENERAL ROUTES FOR SELLER, ADMIN, BUYER

module.exports = router