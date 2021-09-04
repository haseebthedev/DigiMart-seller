const express = require('express')
const router = express.Router()
const customizationsController = require('../controller/buyerCustomizations.controller')
const auth = require('../../users/auth')

//ROUTES FOR ADMIN
router.post('/superAdmin/buyerPanel/colours',auth.superAdmin, customizationsController.updateBuyerPanelColours)
router.get('/superAdmin/buyerPanel/colours', auth.superAdmin, customizationsController.getBuyerPanelColours)
router.post('/superAdmin/buyerPanel/logo', auth.superAdmin, customizationsController.updateBuyerPanelLogo)
router.get('/superAdmin/buyerPanel/logo', auth.superAdmin, customizationsController.getBuyerPanelLogo)
router.post('/superAdmin/buyerPanel/customization', auth.superAdmin, customizationsController.updateAllCustomizations)
router.get('/superAdmin/buyerPanel/customization', auth.superAdmin, customizationsController.getAllCustomizations)
//slider images
router.post('/superAdmin/buyerPanel/customization/sliderImage', auth.superAdmin, customizationsController.addBannerImage)
router.patch('/superAdmin/buyerPanel/customization/sliderImage/:id', auth.superAdmin, customizationsController.updateBannerImageById)
router.delete('/superAdmin/buyerPanel/customization/sliderImage/:id', auth.superAdmin, customizationsController.deleteBannerImageById)
router.get('/superAdmin/buyerPanel/customization/sliderImage/:id', auth.superAdmin, customizationsController.getBannerImageById)
router.get('/superAdmin/buyerPanel/sliderImages', auth.superAdmin, customizationsController.getAllBannerImages)
//header routes
router.post('/superAdmin/buyerPanel/customization/headerNavigation', auth.superAdmin, customizationsController.addHeaderNavigation)
router.patch('/superAdmin/buyerPanel/customization/headerNavigation/:id', auth.superAdmin, customizationsController.updateHeaderNavigationById)
router.delete('/superAdmin/buyerPanel/customization/headerNavigation/:id', auth.superAdmin, customizationsController.deleteHeaderNavigationById)
router.get('/superAdmin/buyerPanel/customization/headerNavigation/:id', auth.superAdmin, customizationsController.getHeaderNavigationById)
router.get('/superAdmin/buyerPanel/headerNavigations', auth.superAdmin, customizationsController.getAllHeaderNavigations)
//footer links
router.post('/superAdmin/buyerPanel/customization/footerLink', auth.superAdmin, customizationsController.addFooterLink)
router.patch('/superAdmin/buyerPanel/customization/footerLink/:id', auth.superAdmin, customizationsController.updateFooterLinkById)
router.delete('/superAdmin/buyerPanel/customization/footerLink/:id', auth.superAdmin, customizationsController.deleteFooterLinkById)
router.get('/superAdmin/buyerPanel/customization/footerLink/:id', auth.superAdmin, customizationsController.getFooterLinkById)
router.get('/superAdmin/buyerPanel/footerLinks', auth.superAdmin, customizationsController.getAllFooterLinks)

//ROUTES FOR BUYER
router.get('/buyer/buyerPanel/colours', customizationsController.getBuyerPanelColours)
router.get('/buyer/buyerPanel/logo', customizationsController.getBuyerPanelLogo)
router.get('/buyer/buyerPanel/customization', customizationsController.getAllCustomizations)
router.get('/buyer/buyerPanel/customization/sliderImage/:id', customizationsController.getBannerImageById)
router.get('/buyer/buyerPanel/sliderImages', customizationsController.getAllBannerImages)
router.get('/buyer/buyerPanel/customization/headerNavigation/:id', customizationsController.getHeaderNavigationById)
router.get('/buyer/buyerPanel/headerNavigations', customizationsController.getAllHeaderNavigations)
router.get('/buyer/buyerPanel/customization/footerLink/:id',  customizationsController.getFooterLinkById)
router.get('/buyer/buyerPanel/footerLinks',  customizationsController.getAllFooterLinks)

module.exports = router