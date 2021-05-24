const express = require('express')
const router = express.Router()
const storeController = require('../controller/store.controller')
const auth = require('../../users/auth')

router.post('/store/register',storeController.registerStore)
router.get('/store/me', auth.vendor ,storeController.getStoreDetails)

module.exports = router