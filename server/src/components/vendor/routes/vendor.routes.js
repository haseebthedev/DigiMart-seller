const express = require('express')
const router = express.Router()
const vendorController = require('../controller/vendor.controller')
const auth = require('../../users/auth')

//FOR ADMIN
router.post('/admin/vendor', auth.superAdmin , vendorController.addVendor)
router.delete('/admin/vendor/:id', auth.superAdmin , vendorController.deleteVendor)
router.patch('/admin/vendor/:id', auth.superAdmin , vendorController.updateVendor)
router.get('/admin/vendor/:id', auth.superAdmin , vendorController.getVendorById)
router.get('/admin/vendors', auth.superAdmin , vendorController.getAllVendors)
router.get('/admin/vendors/requests', auth.superAdmin , vendorController.getAllRequestedVendors)
router.get('/admin/vendors/approved', auth.superAdmin , vendorController.getAllApprovedVendors)
router.get('/admin/vendors/:category', auth.superAdmin , vendorController.getAllVendorsByCategoryName)

//FOR SELLER
router.post('/seller/vendor', auth.seller , vendorController.requestVendor)
router.get('/seller/vendor/:id', auth.seller , vendorController.getVendorById)
router.get('/seller/vendors', auth.seller , vendorController.getAllVendors)
router.get('/seller/vendors/:category', auth.seller , vendorController.getAllVendorsByCategoryName)

module.exports = router