const express = require("express");
const router = express.Router();
const adminController = require("../controllers/superAdmin.controller");
const superAdminAuth = require("../middlewares/superAdminAuth");

//ROUTES FOR SUPER ADMIN's OWN PROFILE
router.post("/superAdmin/login", adminController.loginSuperAdmin);
router.get("/superAdmin/me", superAdminAuth, adminController.getMyDetails);
router.post(
	"/superAdmin/logout",
	superAdminAuth,
	adminController.logoutSuperAdmin
);
router.patch(
	"/superAdmin/activateMyAccount",
	superAdminAuth,
	adminController.activateMyAccount
);
router.patch(
	"/superAdmin/deActivateMyAccount",
	superAdminAuth,
	adminController.deActivateMyAccount
);
router.delete(
	"/superAdmin/me",
	superAdminAuth,
	adminController.deleteMyAccount
);
router.patch("/superAdmin/me", superAdminAuth, adminController.updateProfile);
router.patch(
	"/superAdmin/updatePassword",
	superAdminAuth,
	adminController.changePassword
);

//ROUTES FOR OPERATIONS ON OTHER SUPER ADMIN
router.get(
	"/superAdmin/admins",
	superAdminAuth,
	adminController.getAllSuperAdmins
);
router.get(
	"/superAdmin/admin/:id",
	superAdminAuth,
	adminController.viewSuperAdminById
);
router.get(
	"/superAdmin/admins/number",
	superAdminAuth,
	adminController.getTotalNumberOfSuperAdmins
);
//routes for owner only
router.post("/superAdmin/register", adminController.registerSuperAdmin);
router.patch(
	"/superAdmin/updateAdmin/:id",
	superAdminAuth,
	adminController.editOtherSuperAdminProfile
);
router.patch(
	"/superAdmin/blockAdmin/:id",
	superAdminAuth,
	adminController.blockOtherSuperAdmin
);
router.patch(
	"/superAdmin/unBlockAdmin/:id",
	superAdminAuth,
	adminController.unBlockOtherSuperAdmin
);

module.exports = router;
