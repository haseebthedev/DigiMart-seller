const express = require('express')
const router = express.Router()
const customizationsController = require('../controller/sellerCustomizations.controller')
const auth = require('../../users/auth')

//ROUTES FOR ADMIN
router.post('/superAdmin/sellerPanel/colours',auth.superAdmin, customizationsController.updateSellerPanelColours)
router.get('/superAdmin/sellerPanel/colours', auth.superAdmin, customizationsController.getSellerPanelColours)
router.post('/superAdmin/sellerPanel/logo', auth.superAdmin, customizationsController.updateSellerPanelLogo)
router.get('/superAdmin/sellerPanel/logo', auth.superAdmin, customizationsController.getSellerPanelLogo)
router.post('/superAdmin/sellerPanel/customization', auth.superAdmin, customizationsController.updateAllCustomizations)
router.get('/superAdmin/sellerPanel/customization', auth.superAdmin, customizationsController.getAllCustomizations)

//ROUTES FOR VENDOR
router.get('/superAdmin/sellerPanel/colours', auth.seller, customizationsController.getSellerPanelColours)
router.get('/superAdmin/sellerPanel/logo', auth.seller, customizationsController.getSellerPanelLogo)
router.get('/superAdmin/sellerPanel/customization', auth.seller, customizationsController.getAllCustomizations)
module.exports = router