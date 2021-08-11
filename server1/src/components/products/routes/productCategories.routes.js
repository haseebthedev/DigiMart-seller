const express = require('express')
const router = express.Router()
const productCategoryController = require('../controller/productCategories.controller')
const auth = require('../../users/auth')

//ROUTES FOR ADMIN
//category
router.post('/admin/product/category', auth.admin , productCategoryController.addCategory)
router.patch('/admin/product/category/:id', auth.admin , productCategoryController.updateCategory)
router.delete('/admin/product/category/:id', auth.admin , productCategoryController.deleteCategory)
router.get('/admin/product/category/:id', auth.admin , productCategoryController.getCategoryById)
router.get('/admin/product/categories/view', auth.admin , productCategoryController.getAllCategories)
router.get('/admin/subCategories/:category', auth.admin, productCategoryController.getAllChildCategoriesOfParent)
//sub category
router.post('/admin/product/subCategory/:category', auth.admin , productCategoryController.addSubCategory)
router.delete('/admin/product/subCategory/:id', auth.admin , productCategoryController.deleteSubCategoryById)
router.patch('/admin/product/subCategory/:id', auth.admin , productCategoryController.updateSubCategoryById)
router.get('/admin/product/subCategory/:id', auth.admin , productCategoryController.getSubCategoryById)
//brands
router.post('/admin/product/brand/:category', auth.admin , productCategoryController.addBrandOfCategory)
router.delete('/admin/product/brand/:id', auth.admin , productCategoryController.deleteBrandById)
router.patch('/admin/product/brand/:id', auth.admin , productCategoryController.updateBrandById)
router.get('/admin/product/brand/:id', auth.admin , productCategoryController.getBrandById)

//ROUTES FOR VENDOR
router.get('/seller/product/category/:id', auth.vendor , productCategoryController.getCategoryById)
router.get('/seller/product/categories', auth.vendor , productCategoryController.getAllCategories)
router.get('/seller/subCategories/brands/:category', auth.vendor, productCategoryController.getAllChildCategoriesOfParent)

module.exports = router