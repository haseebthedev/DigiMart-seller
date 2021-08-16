const express = require('express')
const router = express.Router()
const vendorCategoryController = require('../controller/vendorCategory.controller')
const auth = require('../../users/auth')

//FOR ADMIN
router.post('/admin/vendorCategory', auth.superAdmin , vendorCategoryController.addCategory)
router.delete('/admin/vendorCategory/:id', auth.superAdmin , vendorCategoryController.deleteCategory)
router.patch('/admin/vendorCategory/:id', auth.superAdmin , vendorCategoryController.updateCategory)
router.get('/admin/vendorCategory/:id', auth.superAdmin , vendorCategoryController.getCategoryById)
router.get('/admin/vendorCategories', auth.superAdmin , vendorCategoryController.getAllCategories)

//FOR SELLER
router.get('/seller/vendorCategory/:id', auth.seller , vendorCategoryController.getCategoryById)
router.get('/seller/vendorCategories', auth.seller , vendorCategoryController.getAllCategories)

module.exports = router