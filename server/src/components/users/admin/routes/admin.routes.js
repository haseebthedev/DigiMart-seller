const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')
const adminAuth = require('../middlewares/adminAuth')

//ROUTES FOR ADMIN's OWN PROFILE
router.post('/admin/login', adminController.loginAdmin)
router.get('/admin/me', adminAuth ,adminController.getMyDetails)
router.post('/admin/logout', adminAuth , adminController.logoutAdmin)
router.patch('/admin/activateMyAccount', adminAuth ,adminController.activateMyAccount)
router.patch('/admin/deActivateMyAccount', adminAuth , adminController.deActivateMyAccount)
router.delete('/admin/me', adminAuth, adminController.deleteMyAccount)
router.patch('/admin/me', adminAuth, adminController.updateProfile)
router.patch('/admin/updatePassword', adminAuth, adminController.changePassword)

//ROUTES FOR SUPER ADMIN
//(to apply operations on other admins)
router.post('/admin/register', adminAuth , adminController.registerAdmin)
router.patch('/superAdmin/updateAdmin/:id', adminAuth, adminController.editOtherAdminProfile )
router.patch('/superAdmin/blockAdmin/:id', adminAuth, adminController.blockOtherAdmin)
router.patch('/superAdmin/unBlockAdmin/:id', adminAuth, adminController.unBlockOtherAdmin)
router.get('/superAdmin/admins', adminAuth, adminController.getAllAdmins )
router.get('/superAdmin/admin/:id', adminAuth, adminController.viewAdminById )
router.get('/superAdmin/admin/role/:role', adminAuth, adminController.getAdminDetailsByRole )
router.get('/superAdmin/admins/number', adminAuth, adminController.getTotalNumberOfAdmins )



module.exports = router