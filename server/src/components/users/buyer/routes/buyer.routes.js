const express = require('express')
const router = express.Router()
const buyerController = require('../controllers/buyer.controller')
const buyerAuth = require('../middlewares/buyerAuth')

router.post('/buyer/register',buyerController.registerBuyer)
router.post('/buyer/login',buyerController.loginBuyer)
router.post('/buyer/logout', buyerAuth ,buyerController.logoutBuyer)
router.post('/buyer/activateAccount', buyerAuth ,buyerController.activateMyAccount)
router.post('/buyer/deActivateAccount', buyerAuth ,buyerController.deActivateMyAccount)
router.delete('/buyer/me', buyerAuth, buyerController.deleteMyAccount)

module.exports = router 