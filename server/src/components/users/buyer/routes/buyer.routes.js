const express = require('express')
const router = express.Router()
const buyerController = require('../controllers/buyer.controller')
const buyerAuth = require('../middlewares/buyerAuth')
const auth = require('../../auth')

router.post('/buyer/register',buyerController.registerBuyer)
router.post('/buyer/login',buyerController.loginBuyer)
router.post('/buyer/logout', buyerAuth ,buyerController.logoutBuyer)
router.patch('/buyer/activateAccount', buyerAuth ,buyerController.activateMyAccount)
router.patch('/buyer/deActivateAccount', buyerAuth ,buyerController.deActivateMyAccount)
router.delete('/buyer/me', buyerAuth, buyerController.deleteMyAccount)
router.patch('/buyer/forgetPassword' , buyerController.forgetAccountPassword)
router.patch('/buyer/me', buyerAuth ,buyerController.updateProfile)
router.patch('/buyer/updatePassword', buyerAuth ,buyerController.changePassword)

//ROUTES FOR ADMIN
router.get('/admin/getAllBuyersDetails', auth.admin, buyerController.getAllBuyersDetails)
router.get('/admin/getTotalNumberOfBuyers', auth.admin, buyerController.getTotalNumberOfBuyers)

module.exports = router 