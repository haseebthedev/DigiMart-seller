const express = require('express')
const router = express.Router()
const customizationsController = require('../controller/superAdminCustomizations.controller')
const auth = require('../../users/auth')


router.post('/superAdmin/adminPanel/colours',auth.superAdmin, customizationsController.updateSuperAdminPanelColours)
router.get('/superAdmin/adminPanel/colours', auth.superAdmin, customizationsController.getSuperAdminPanelColours)
router.post('/superAdmin/adminPanel/logo', auth.superAdmin, customizationsController.updateSuperAdminPanelLogo)
router.get('/superAdmin/adminPanel/logo', auth.superAdmin, customizationsController.getSuperAdminPanelLogo)
router.post('/superAdmin/adminPanel/customization', auth.superAdmin, customizationsController.updateAllCustomizations)
router.get('/superAdmin/adminPanel/customization', auth.superAdmin, customizationsController.getAllCustomizations)

router.get('/superAdmin/adminPanel/colours', auth.superAdmin, customizationsController.getSuperAdminPanelColours)
router.get('/superAdmin/adminPanel/logo', auth.superAdmin, customizationsController.getSuperAdminPanelLogo)
router.get('/superAdmin/adminPanel/customization', auth.superAdmin, customizationsController.getAllCustomizations)

module.exports = router