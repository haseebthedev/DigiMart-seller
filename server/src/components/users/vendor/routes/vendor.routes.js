const express = require('express')
const router = express.Router()
const vendorController = require('../controllers/vendor.controller')
const vendorAuth = require('../middlewares/vendorAuth')

//registration
router.post('/seller/register', vendorController.registerVendor)
router.post('/seller/login', vendorController.loginVendor)
router.post('/seller/logout', vendorAuth ,vendorController.logoutVendor)

//when vendor activates account after deactivating so we call this route
router.patch('/seller/activateAccount', vendorAuth, vendorController.activateMyAccount)
router.patch('/seller/deActivateAccount', vendorAuth, vendorController.deActivateMyAccount)

//for ading bank details after vendor registration
router.patch('/seller/addBankDetailsAndRegisterStore', vendorAuth ,vendorController.addBankDetails)
router.delete('/seller/me', vendorAuth, vendorController.deleteMyAccount)

//forget Password
router.patch('/seller/forgetPassword' , vendorController.forgetAccountPassword)

//update profile
router.patch('/seller/me', vendorAuth ,vendorController.updateProfile)

//get private details(for getting bank details etc. when required)
router.get('/seller/personalDetails', vendorAuth, vendorController.getPersonalDetails)

//change password
router.patch('/seller/updatePassword', vendorAuth, vendorController.changePassword)

module.exports = router