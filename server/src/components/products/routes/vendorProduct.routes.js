const express = require('express')
const router = express.Router()
const vendorProductController = require('../controller/vendorProduct.controller')
const auth = require('../../users/auth')

//ROUTES FOR ADMIN
router.post('/superAdmin/vendor/:id/product', auth.superAdmin, vendorProductController.addVendorProductById)
router.post('/superAdmin/vendorName/:name/product', auth.superAdmin, vendorProductController.addVendorProductByVendorName)
router.patch('/superAdmin/vendor/product/:id', auth.superAdmin, vendorProductController.updateVendorProductById)
router.delete('/superAdmin/vendor/product/:id', auth.superAdmin, vendorProductController.deleteVendorProductById)
router.delete('/superAdmin/vendor/:id/products', auth.superAdmin, vendorProductController.deleteAllVendorProductsById)
router.get('/superAdmin/vendor/:id/products', auth.superAdmin, vendorProductController.viewVendorAllProductsById)
router.get('/superAdmin/vendor/product/:id', auth.superAdmin, vendorProductController.viewVendorProductById)
router.get('/superAdmin/vendors/products/:category', auth.superAdmin, vendorProductController.viewAllProductsByProductCategory)
router.get('/superAdmin/vendors/products', auth.superAdmin, vendorProductController.viewAllProductsOfAllVendors)

//ROUTES FOR SELLER
router.get('/seller/vendors/products', auth.seller, vendorProductController.viewAllProductsOfAllVendors)
router.get('/seller/vendor/:id/products', auth.seller, vendorProductController.viewActiveVendorAllProducts)
router.get('/seller/vendor/product/:id', auth.seller, vendorProductController.viewVendorProductById)
router.get('/seller/vendors/products/:category', auth.seller, vendorProductController.viewAllProductsByProductCategory)

module.exports = router
