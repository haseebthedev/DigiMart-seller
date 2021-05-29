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
router.get('/admin/totalStoreApprovals', auth.admin, storeController.getTotalNumberOfStoreApprovals)
router.get('/admin/totalStoresApproved', auth.admin, storeController.getTotalNumberOfStoresApproved)

module.exports = router