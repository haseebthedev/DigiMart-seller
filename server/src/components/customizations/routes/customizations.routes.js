const express = require('express')
const router = express.Router()
const customizationsController = require('../controller/customizations.controller')
const auth = require('../../users/auth')

//ROUTES FOR ADMIN
router.post('/admin/updateVendorPanelColours',auth.admin, customizationsController.updateVendorPanelColours)
router.get('/admin/getVendorPanelColours', auth.admin, customizationsController.getVendorPanelColours)
router.post('/admin/updateVendorPanelLogo', auth.admin, customizationsController.updateVendorPanelLogo)
router.get('/admin/getVendorPanelLogo', auth.admin, customizationsController.getVendorPanelLogo)

//ROUTES FOR VENDOR
router.get('/seller/getVendorPanelColours', auth.vendor, customizationsController.getVendorPanelColours)
router.get('/seller/getVendorPanelLogo', auth.vendor, customizationsController.getVendorPanelLogo)

module.exports = router