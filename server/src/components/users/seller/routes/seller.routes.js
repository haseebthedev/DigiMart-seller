const express = require('express')
const router = express.Router()
const sellerController = require('../controllers/seller.controller')
const sellerAuth = require('../middlewares/sellerAuth')
const auth = require('../../auth')

//registration
router.post('/seller/register', sellerController.registerSeller)
router.post('/seller/login', sellerController.loginSeller)
router.post('/seller/logout', sellerAuth ,sellerController.logoutSeller)

//when seller activates account after deactivating so we call this route
router.patch('/seller/activateAccount', sellerAuth, sellerController.activateMyAccount)
router.patch('/seller/deActivateAccount', sellerAuth, sellerController.deActivateMyAccount)

//for ading bank details after seller registration
router.patch('/seller/addPaymentAccount', sellerAuth ,sellerController.addBankDetails)
router.patch('/seller/updatePaymentAccount/:id', sellerAuth, sellerController.updateBankAccountDetailsById)
router.delete('/seller/paymentAccount/:id', sellerAuth, sellerController.deleteBankAccountById)
router.delete('/seller/me', sellerAuth, sellerController.deleteMyAccount)

//forget Password
router.patch('/seller/forgetPassword' , sellerController.forgetAccountPassword)

//update profile
router.patch('/seller/me', sellerAuth ,sellerController.updateProfile)
router.patch('/seller/store/register', sellerAuth ,sellerController.registerStore)

//get private details(for getting bank details etc. when required)
router.get('/seller/personalDetails', sellerAuth, sellerController.getPersonalDetails)
router.get('/seller/bankDetails', sellerAuth, sellerController.getBankDetails)

//change password
router.patch('/seller/updatePassword', sellerAuth, sellerController.changePassword)


//ROUTES FOR ADMIN
router.get('/superAdmin/sellers/totalNumber', auth.superAdmin, sellerController.getTotalNumberOfSellers)
router.get('/superAdmin/sellers', auth.superAdmin, sellerController.getAllSellersDetails)
router.get('/superAdmin/sellers/stores/unregistered', auth.superAdmin, sellerController.viewAllSellersWhoseStoresNotRegistered)
router.patch('/superAdmin/seller/block/:id', auth.superAdmin, sellerController.blockSellerById)
router.patch('/superAdmin/seller/unblock/:id', auth.superAdmin, sellerController.unblockSellerById)
router.post('/superAdmin/seller/register', auth.superAdmin, sellerController.registerSeller)
router.patch('/superAdmin/seller/account/:id', auth.superAdmin, sellerController.editSellerById)
router.get('/superAdmin/seller/account/:id', auth.superAdmin, sellerController.viewSellerById)

module.exports = router