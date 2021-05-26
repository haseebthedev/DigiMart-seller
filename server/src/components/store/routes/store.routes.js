const express = require('express')
const router = express.Router()
const storeController = require('../controller/store.controller')
const auth = require('../../users/auth')

router.post('/store/register', auth.vendor ,storeController.registerStore)
router.get('/store/me', auth.vendor ,storeController.getStoreDetails)
router.patch('/store/me', auth.vendor, storeController.updateStore)

module.exports = router