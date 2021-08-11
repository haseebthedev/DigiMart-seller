const express = require('express')
const router = express.Router()
const customizationsController = require('../controller/adminCustomizations.controller')
const auth = require('../../users/auth')

//ROUTES FOR SUPER ADMIN
router.post('/superAdmin/adminPanel/colours',auth.admin, customizationsController.updateAdminPanelColours)
router.get('/superAdmin/adminPanel/colours', auth.admin, customizationsController.getAdminPanelColours)
router.post('/superAdmin/adminPanel/logo', auth.admin, customizationsController.updateAdminPanelLogo)
router.get('/superAdmin/adminPanel/logo', auth.admin, customizationsController.getAdminPanelLogo)
router.post('/superAdmin/adminPanel/customization', auth.admin, customizationsController.updateAllCustomizations)
router.get('/superAdmin/adminPanel/customization', auth.admin, customizationsController.getAllCustomizations)

//ROUTES FOR ADMIN
router.get('/admin/adminPanel/colours', auth.admin, customizationsController.getAdminPanelColours)
router.get('/admin/adminPanel/logo', auth.admin, customizationsController.getAdminPanelLogo)
router.get('/admin/adminPanel/customization', auth.admin, customizationsController.getAllCustomizations)

module.exports = router