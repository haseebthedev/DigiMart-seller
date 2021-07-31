const express = require('express')
const router = express.Router()
const storeController = require('../controller/store.controller')
const auth = require('../../users/auth')
const Store = require('../model/store.model')

//ROUTES FOR AUTHENTICATED VENDOR
router.post('/seller/store/register', auth.vendor ,storeController.registerStore)
router.get('/seller/store/me', auth.vendor ,storeController.getStoreDetails)
router.patch('/seller/store/me', auth.vendor, storeController.updateStore)

//ROUTES FOR ADMIN
router.get('/admin/store/approvals/number', auth.admin, storeController.getTotalNumberOfStoreApprovals)
router.get('/admin/stores/approved/number', auth.admin, storeController.getTotalNumberOfStoresApproved)
//for updating store
router.patch('/admin/approveStore/:id', auth.admin, storeController.approveStore)
router.patch('/admin/disApproveStore/:id', auth.admin, storeController.disApproveStore)
router.patch('/admin/enableMarketingTool/:id', auth.admin, storeController.enableMarketingService)
router.patch('/admin/disableMarketingTool/:id', auth.admin, storeController.disableMarketingService)
router.get('/admin/stores', auth.admin, storeController.viewAllStores)
router.get('/admin/store/:id', auth.admin, storeController.viewStoreById)
router.patch('/admin/store/:id', auth.admin, storeController.editStoreById)

module.exports = router