const express = require('express')
const router = express.Router()
const vendorController = require('../controllers/vendor.controller')
const vendorAuth = require('../middlewares/vendorAuth')
const auth = require('../../auth')

//registration
router.post('/seller/register', vendorController.registerVendor)
router.post('/seller/login', vendorController.loginVendor)
router.post('/seller/logout', vendorAuth ,vendorController.logoutVendor)

//when vendor activates account after deactivating so we call this route
router.patch('/seller/activateAccount', vendorAuth, vendorController.activateMyAccount)
router.patch('/seller/deActivateAccount', vendorAuth, vendorController.deActivateMyAccount)

//for ading bank details after vendor registration
router.patch('/seller/addPaymentAccount', vendorAuth ,vendorController.addBankDetails)
router.patch('/seller/updatePaymentAccount/:id', vendorAuth, vendorController.updateBankAccountDetailsById)
router.delete('/seller/paymentAccount/:id', vendorAuth, vendorController.deleteBankAccountById)
router.delete('/seller/me', vendorAuth, vendorController.deleteMyAccount)

//forget Password
router.patch('/seller/forgetPassword' , vendorController.forgetAccountPassword)

//update profile
router.patch('/seller/me', vendorAuth ,vendorController.updateProfile)
router.patch('/seller/store/register', vendorAuth ,vendorController.registerStore)

//get private details(for getting bank details etc. when required)
router.get('/seller/personalDetails', vendorAuth, vendorController.getPersonalDetails)
router.get('/seller/bankDetails', vendorAuth, vendorController.getBankDetails)

//change password
router.patch('/seller/updatePassword', vendorAuth, vendorController.changePassword)


//ROUTES FOR ADMIN
router.get('/admin/sellers/totalNumber', auth.admin, vendorController.getTotalNumberOfVendors)
router.get('/admin/sellers', auth.admin, vendorController.getAllVendorsDetails)
router.patch('/admin/seller/block/:id', auth.admin, vendorController.blockVendorById)
router.patch('/admin/seller/unblock/:id', auth.admin, vendorController.unblockVendorById)
router.post('/admin/seller/register', auth.admin, vendorController.registerVendor)
router.patch('/admin/seller/account/:id', auth.admin, vendorController.editVendorById)
router.get('/admin/seller/account/:id', auth.admin, vendorController.viewVendorById)

module.exports = router