const express = require('express')
const router = express.Router()
const promotionAudienceController = require('../controller/promotionAudience.controller')
const auth = require('../../users/auth')

//ROUTES FOR SUPER ADMIN
router.post('/admin/promotion/audience', auth.admin, promotionAudienceController.addPromotionAudience)
router.patch('/admin/promotion/audience/:category', auth.admin, promotionAudienceController.updatePromotionAudienceByCategory)
router.delete('/admin/promotion/audience/:category', auth.admin, promotionAudienceController.deletePromotionAudienceByCategory)
router.get('/admin/promotion/audience/:category', auth.admin, promotionAudienceController.getPromotionAudienceOfProductCategory)
router.patch('/admin/promotion/audience/interestCategory/:id', auth.admin, promotionAudienceController.updateAudienceInterestCategoryById)
router.get('/admin/promotion/audience', auth.admin, promotionAudienceController.getPromotionAudienceOfAllCategories)
router.patch('/admin/promotion/audience/productCategory/:id', auth.admin, promotionAudienceController.addProductCategoriesInPromotionAudienceById)
router.delete('/admin/promotion/audience/productCategory/:id', auth.admin, promotionAudienceController.deleteProductCategoriesInPromotionAudienceById)

//ROUTES FOR SELLER
router.get('/seller/promotion/audience/:category', auth.vendor, promotionAudienceController.getPromotionAudienceOfProductCategory)

module.exports = router