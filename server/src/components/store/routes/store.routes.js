const express = require('express')
const router = express.Router()
const storeController = require('../controller/store.controller')
const auth = require('../../users/auth')

//ROUTES FOR AUTHENTICATED SELLER
router.post('/seller/store/register', auth.seller ,storeController.registerStore)
router.get('/seller/store/me', auth.seller ,storeController.getStoreDetails)
router.patch('/seller/store/me', auth.seller, storeController.updateStore)
router.get('/seller/store/category', auth.seller, storeController.getStoreCategory)

//ROUTES FOR ADMIN
router.get('/superAdmin/store/approvals/number', auth.superAdmin, storeController.getTotalNumberOfStoreApprovals)
router.get('/superAdmin/stores/approved/number', auth.superAdmin, storeController.getTotalNumberOfStoresApproved)
//for updating store
router.post('/superAdmin/store/register/seller/:id', auth.superAdmin ,storeController.addStoreOfSellerById)
router.patch('/superAdmin/approveStore/:id', auth.superAdmin, storeController.approveStore)
router.patch('/superAdmin/disApproveStore/:id', auth.superAdmin, storeController.disApproveStore)
router.patch('/superAdmin/enableMarketingTool/:id', auth.superAdmin, storeController.enableMarketingService)
router.patch('/superAdmin/disableMarketingTool/:id', auth.superAdmin, storeController.disableMarketingService)
router.get('/superAdmin/stores', auth.superAdmin, storeController.viewAllStores)
router.get('/superAdmin/stores/approvals', auth.superAdmin, storeController.viewAllStoreApprovals)
router.get('/superAdmin/stores/approved', auth.superAdmin, storeController.viewAllStoresApproved)
router.get('/superAdmin/store/:id', auth.superAdmin, storeController.viewStoreById)
router.patch('/superAdmin/store/:id', auth.superAdmin, storeController.editStoreById)

module.exports = router