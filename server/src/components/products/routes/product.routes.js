const express = require('express')
const router = express.Router()
const productController = require('../controller/product.controller')
const auth = require('../../users/auth')

//ROUTES FOR BUYER
router.get('/buyer/products' , productController.viewAllProductsInAllStoresForBuyer)
router.get('/buyer/products/category/:category' , productController.viewProductsOfSpecificCategory)
router.get('/buyer/products/subCategory/:subCategory' , productController.viewProductsOfSpecificSubCategory)
router.get('/buyer/products/onSale' , productController.viewProductsOnSale)
router.get('/buyer/products/topReviewed' , productController.viewTopReviewedProducts)
router.get('/buyer/products/store/:id' , productController.viewProductsOfStoreById)
router.get('/buyer/products/search' , productController.searchProducts)
router.post('/buyer/products/filter' , productController.filterProducts)
router.post('/buyer/products/sort/topSelling', productController.getTopSellingProducts)
router.get('/buyer/product/:id', productController.getProductDetailsForBuyer)

//ROUTES FOR AUTHENTICATED SELLER
router.post('/seller/store/product', auth.seller, productController.addProductToMyStore)
router.patch('/seller/store/product/:id', auth.seller, productController.updateProduct)
router.delete('/seller/store/product/:id', auth.seller, productController.deleteProduct)
router.delete('/seller/store/products', auth.seller, productController.deleteAllProductsOfStore)
router.get('/seller/store/products', auth.seller, productController.viewMyStoreAllProducts)
router.get('/seller/store/products/vendor', auth.seller, productController.viewStoreProductsSelectedByVendorsProducts)
router.get('/seller/store/products/own', auth.seller, productController.viewStoreOwnProducts)
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
router.delete('/superAdmin/store/:id/products', auth.superAdmin, productController.deleteAllProductsOfStore)
router.post('/superAdmin/product/store/:id', auth.superAdmin, productController.addProductByStoreId)
router.post('/superAdmin/product/storeName/:name', auth.superAdmin, productController.addProductByStoreName)
router.get('/superAdmin/store/:id/products/vendor', auth.superAdmin, productController.viewStoreProductsSelectedByVendorsProducts)
router.get('/superAdmin/store/:id/products/own', auth.superAdmin, productController.viewStoreOwnProducts)

//GENERAL ROUTES FOR SELLER, ADMIN, BUYER

module.exports = router