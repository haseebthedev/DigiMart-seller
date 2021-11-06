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
router.get('/superAdmin/product/mainCategories/list', auth.superAdmin , productCategoryController.getAllMainCategories)
router.post('/superAdmin/subCategories/vendor/category', auth.superAdmin, productCategoryController.getAllSubCategoriesOfVendorMainCategory)
router.get('/superAdmin/mainCategories/vendor/:vendor/category/:category', auth.superAdmin,
 productCategoryController.getAllMainCategoriesByVendorNameAndCategory)
//sub category
router.post('/superAdmin/product/subCategory', auth.superAdmin , productCategoryController.addSubCategory)
router.delete('/superAdmin/product/subCategory/:id', auth.superAdmin , productCategoryController.deleteSubCategoryById)
router.patch('/superAdmin/product/subCategory/:id', auth.superAdmin , productCategoryController.updateSubCategoryById)
router.get('/superAdmin/product/subCategory/:id', auth.superAdmin , productCategoryController.getSubCategoryById)
router.get('/superAdmin/product/subCategories/list', auth.superAdmin , productCategoryController.getAllSubCategories)


//ROUTES FOR SELLER
router.get('/seller/product/category/:id', auth.seller , productCategoryController.getCategoryById)
router.get('/seller/product/categories', auth.seller , productCategoryController.getAllCategories)
router.get('/seller/subCategories/category/:mainCategory', auth.seller, productCategoryController.getAllSubCategoriesOfMainCategory)
router.get('/seller/product/mainCategories/list', auth.seller , productCategoryController.getAllMainCategories)
router.get('/seller/mainCategories/vendor/:vendor/category/:category', auth.seller,
 productCategoryController.getAllMainCategoriesByVendorNameAndCategory)

 //ROUTES FOR BUYER
 router.get('/buyer/product/categories/all', productCategoryController.getAllCategories)
 router.get('/buyer/product/subCategoriesNames/mainCategory/:mainCategory', productCategoryController.getNamesOfAllSubCategoriesOfMainCategory)
 router.get('/buyer/product/subCategoriesNames/all', productCategoryController.getNamesOfAllSubCategoriesForBuyer)
 //Vendors (Brands)
router.get('/buyer/vendors/mainCategory/:category', productCategoryController.getAllVendorsByMainCategory)
router.get('/buyer/vendors/subCategory/:category', productCategoryController.getAllVendorsBySubCategory)
router.get('/buyer/vendors/all', productCategoryController.getAllVendorsForBuyer)
 

module.exports = router