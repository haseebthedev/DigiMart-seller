const express = require('express')
const router = express.Router()
const customizationsController = require('../controller/buyerCustomizations.controller')
const auth = require('../../users/auth')

//ROUTES FOR ADMIN
router.post('/admin/buyerPanel/colours',auth.admin, customizationsController.updateBuyerPanelColours)
router.get('/admin/buyerPanel/colours', auth.admin, customizationsController.getBuyerPanelColours)
router.post('/admin/buyerPanel/logo', auth.admin, customizationsController.updateBuyerPanelLogo)
router.get('/admin/buyerPanel/logo', auth.admin, customizationsController.getBuyerPanelLogo)
router.post('/admin/buyerPanel/customization', auth.admin, customizationsController.updateAllCustomizations)
router.get('/admin/buyerPanel/customization', auth.admin, customizationsController.getAllCustomizations)
//slider images
router.post('/admin/buyerPanel/customization/sliderImage', auth.admin, customizationsController.addBannerImage)
router.patch('/admin/buyerPanel/customization/sliderImage/:id', auth.admin, customizationsController.updateBannerImageById)
router.delete('/admin/buyerPanel/customization/sliderImage/:id', auth.admin, customizationsController.deleteBannerImageById)
router.get('/admin/buyerPanel/customization/sliderImage/:id', auth.admin, customizationsController.getBannerImageById)
router.get('/admin/buyerPanel/sliderImages', auth.admin, customizationsController.getAllBannerImages)
//header routes
router.post('/admin/buyerPanel/customization/headerNavigation', auth.admin, customizationsController.addHeaderNavigation)
router.patch('/admin/buyerPanel/customization/headerNavigation/:id', auth.admin, customizationsController.updateHeaderNavigationById)
router.delete('/admin/buyerPanel/customization/headerNavigation/:id', auth.admin, customizationsController.deleteHeaderNavigationById)
router.get('/admin/buyerPanel/customization/headerNavigation/:id', auth.admin, customizationsController.getHeaderNavigationById)
router.get('/admin/buyerPanel/headerNavigations', auth.admin, customizationsController.getAllHeaderNavigations)
//footer links
router.post('/admin/buyerPanel/customization/footerLink', auth.admin, customizationsController.addFooterLink)
router.patch('/admin/buyerPanel/customization/footerLink/:id', auth.admin, customizationsController.updateFooterLinkById)
router.delete('/admin/buyerPanel/customization/footerLink/:id', auth.admin, customizationsController.deleteFooterLinkById)
router.get('/admin/buyerPanel/customization/footerLink/:id', auth.admin, customizationsController.getFooterLinkById)
router.get('/admin/buyerPanel/footerLinks', auth.admin, customizationsController.getAllFooterLinks)

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