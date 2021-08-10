const express = require('express')
const router = express.Router()
const customizationsController = require('../controller/vendorCustomizations.controller')
const auth = require('../../users/auth')

//ROUTES FOR ADMIN
router.post('/admin/sellerPanel/colours',auth.admin, customizationsController.updateVendorPanelColours)
router.get('/admin/sellerPanel/colours', auth.admin, customizationsController.getVendorPanelColours)
router.post('/admin/sellerPanel/logo', auth.admin, customizationsController.updateVendorPanelLogo)
router.get('/admin/sellerPanel/logo', auth.admin, customizationsController.getVendorPanelLogo)
router.post('/admin/sellerPanel/customization', auth.admin, customizationsController.updateAllCustomizations)
router.get('/admin/sellerPanel/customization', auth.admin, customizationsController.getAllCustomizations)

//ROUTES FOR VENDOR
router.get('/seller/sellerPanel/colours', auth.vendor, customizationsController.getVendorPanelColours)
router.get('/seller/sellerPanel/logo', auth.vendor, customizationsController.getVendorPanelLogo)
router.get('/seller/sellerPanel/customization', auth.vendor, customizationsController.getAllCustomizations)
module.exports = router