const express = require('express')
const router = express.Router()
const storeController = require('../controller/store.controller')
const auth = require('../../users/auth')

//ROUTES FOR AUTHENTICATED VENDOR
router.post('/seller/store/register', auth.vendor ,storeController.registerStore)
router.get('/seller/store/me', auth.vendor ,storeController.getStoreDetails)
router.patch('/seller/store/me', auth.vendor, storeController.updateStore)

//ROUTES FOR ADMIN

module.exports = router