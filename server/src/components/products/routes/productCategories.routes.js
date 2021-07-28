const express = require('express')
const router = express.Router()
const productCategoryController = require('../controller/productCategories.controller')
const auth = require('../../users/auth')

//ROUTES FOR ADMIN
router.post('/admin/product/category', auth.admin , productCategoryController.addCategory)
router.patch('/admin/product/category/:id', auth.admin , productCategoryController.updateCategory)
router.delete('/admin/product/category/:id', auth.admin , productCategoryController.deleteCategory)
router.get('/admin/product/category/:id', auth.admin , productCategoryController.getCategoryById)
router.get('/admin/product/categories', auth.admin , productCategoryController.getAllCategories)
router.get('/admin/subCategories/:category', auth.admin, productCategoryController.getAllChildCategoriesOfParent)

//ROUTES FOR VENDOR
router.get('/seller/product/category/:id', auth.vendor , productCategoryController.getCategoryById)
router.get('/seller/product/categories', auth.vendor , productCategoryController.getAllCategories)
router.get('/seller/subCategories/:category', auth.vendor, productCategoryController.getAllChildCategoriesOfParent)

module.exports = router