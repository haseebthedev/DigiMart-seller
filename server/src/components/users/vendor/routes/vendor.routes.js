const express = require('express')
const router = express.Router()
const vendorController = require('../controllers/vendor.controller')
const vendorAuth = require('../middlewares/vendorAuth')

router.post('/seller/register', vendorController.registerVendor)
router.post('/seller/login', vendorController.loginVendor)
router.post('/seller/logout', vendorAuth ,vendorController.logoutVendor)
//when vendor activates account after deactivating so we call this route
router.post('/seller/activateAccount', vendorAuth, vendorController.activateMyAccount)
router.post('/seller/deActivateAccount', vendorAuth, vendorController.deActivateMyAccount)
//for ading bank details after vendor registration
router.post('/seller/addBankDetailsAndRegisterStore', vendorAuth ,vendorController.addBankDetails)
router.delete('/seller/me', vendorAuth, vendorController.deleteMyAccount)
module.exports = router