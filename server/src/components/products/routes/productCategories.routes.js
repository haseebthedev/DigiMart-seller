const express = require('express')
const router = express.Router()
const productCategoryController = require('../controller/productCategories.controller')
const auth = require('../../users/auth')

//ROUTES FOR ADMIN
//category
router.post('/superAdmin/product/category', auth.superAdmin , productCategoryController.addCategory)
router.patch('/superAdmin/product/category/:id', auth.superAdmin , productCategoryController.updateCategory)
router.delete('/superAdmin/product/category/:id', auth.superAdmin , productCategoryController.deleteCategory)
router.get('/superAdmin/product/category/:id', auth.superAdmin , productCategoryController.getCategoryById)
router.get('/superAdmin/product/categories/view', auth.superAdmin , productCategoryController.getAllCategories)
router.post('/superAdmin/categories/vendor/category', auth.superAdmin, productCategoryController.getAllSubCategoriesOfVendorMainCategory)
//sub category
router.post('/superAdmin/product/subCategory', auth.superAdmin , productCategoryController.addSubCategory)
router.delete('/superAdmin/product/subCategory/:id', auth.superAdmin , productCategoryController.deleteSubCategoryById)
router.patch('/superAdmin/product/subCategory/:id', auth.superAdmin , productCategoryController.updateSubCategoryById)
router.get('/superAdmin/product/subCategory/:id', auth.superAdmin , productCategoryController.getSubCategoryById)
// //brands
// router.post('/superAdmin/product/brand/:category', auth.superAdmin , productCategoryController.addBrandOfCategory)
// router.delete('/superAdmin/product/brand/:id', auth.superAdmin , productCategoryController.deleteBrandById)
// router.patch('/superAdmin/product/brand/:id', auth.superAdmin , productCategoryController.updateBrandById)
// router.get('/superAdmin/product/brand/:id', auth.superAdmin , productCategoryController.getBrandById)

//ROUTES FOR SELLER
router.get('/seller/product/category/:id', auth.seller , productCategoryController.getCategoryById)
router.get('/seller/product/categories', auth.seller , productCategoryController.getAllCategories)
router.post('/seller/categories/vendor/category', auth.seller, productCategoryController.getAllSubCategoriesOfVendorMainCategory)

module.exports = router