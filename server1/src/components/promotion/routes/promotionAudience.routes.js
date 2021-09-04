const express = require('express')
const router = express.Router()
const promotionAudienceController = require('../controller/promotionAudience.controller')
const auth = require('../../users/auth')

//ROUTES FOR SUPER ADMIN
router.post('/superAdmin/promotion/audience', auth.superAdmin, promotionAudienceController.addPromotionAudience)
router.patch('/superAdmin/promotion/audience/:category', auth.superAdmin, promotionAudienceController.updatePromotionAudienceByCategory)
router.delete('/superAdmin/promotion/audience/:category', auth.superAdmin, promotionAudienceController.deletePromotionAudienceByCategory)
router.get('/superAdmin/promotion/audience/:category', auth.superAdmin, promotionAudienceController.getPromotionAudienceOfProductCategory)
router.patch('/superAdmin/promotion/audience/interestCategory/:id', auth.superAdmin, promotionAudienceController.updateAudienceInterestCategoryById)
router.get('/superAdmin/promotion/audience', auth.superAdmin, promotionAudienceController.getPromotionAudienceOfAllCategories)
router.patch('/superAdmin/promotion/audience/productCategory/:id', auth.superAdmin, promotionAudienceController.addProductCategoriesInPromotionAudienceById)
router.delete('/superAdmin/promotion/audience/productCategory/:id', auth.superAdmin, promotionAudienceController.deleteProductCategoriesInPromotionAudienceById)

//ROUTES FOR SELLER
router.get('/seller/promotion/audience/:category', auth.seller, promotionAudienceController.getPromotionAudienceOfProductCategory)

module.exports = router