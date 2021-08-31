const Seller = require("../models/seller.model");
const bcrypt = require("bcryptjs");
const notification = require("../../../notifications/account");
const Product = require("../../../products/model/product.model");
const Review = require("../../../review/model/review.model");
const Order = require("../../../orders/model/order.model");
const PromoteProduct = require("../../../promotion/model/promoteProduct.model");
const ReportProblem = require("../../../reportProblem/model/report.model");
const OrderProblemReport = require("../../../reportProblem/model/orderReport.model");
const Store = require("../../../store/model/store.model");

const registerSeller = async (req, res, next) => {
	try {
		const seller = new Seller(req.body);
		await seller.save();
		const token = await seller.generateAuthToken();
		//send registration mail
		const subject = "Digi-Mart Seller Registration Email";
		const message = `You have successfully registered your Email ${seller.email} with Digi-Mart.
        To sell products and make money, register your store on Digi-Mart by providing necessary details and be part of Digi-Mart seller family.
        <br><strong>Thank you for your time.</strong>`;
		notification.sendNotificationMail(
			seller.email,
			subject,
			message,
			seller.name
		);
		res.status(201).json({
			message: `${seller.name} your request for registration has been sent successfully!`,
			data: {
				seller: seller,
				token: token,
			},
		});
	} catch (err) {
		//err.message='not added'
		err.status = 404;
		next(err);
	}
};

const loginSeller = async (req, res, next) => {
	try {
		const seller = await Seller.findByCredientials(
			req.body.email,
			req.body.password
		);
		//check if account bloecked then send error message
		if (seller.status == "Blocked") {
			throw new Error("Your account has been blocked by admin !");
		}
		if (seller.status == "Deactivate") {
			//activate account status
			req.user.status = "Active";
			//save user
			await req.user.save();
			//active store
			req.store.status = "Active";
			//If products, then set its products visisble
			const productsOfStore = await Product.find({
				storeID: req.store._id,
			});
			if (productsOfStore) {
				productsOfStore.forEach(async (product) => {
					product.isVisibilityEnabled = false;
					await product.save();
				});
			}
			//save store
			await req.store.save();
		}
		const token = await seller.generateAuthToken();
		//save seller
		await seller.save();

		res.json({
			message: `You are logged in successfully! Welcome to DigiMart.`,
			data: {
				seller: seller,
				token: token,
				isStoreRegistered: seller.isStoreRegistered,
			},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

const logoutSeller = async (req, res, next) => {
	try {
		// it remove the token of device from which u logged in
		req.user.tokens = req.user.tokens.filter((tokens) => {
			//if tokens.token !== req.token it returns false filtering it out
			return tokens.token !== req.token;
		});
		await req.user.save();
		res.status(200).json({
			message: `Logged out from the device successfully!`,
			data: {
				email: req.user.email,
			},
		});
	} catch (e) {
		e.status = 500;
		next(e);
	}
};

const deleteMyAccount = async (req, res, next) => {
	try {
		let storeName = "";
		const seller = req.user;
		if (req.store) {
			const store = req.store;
			storeName = req.store.name;
			//if store delete, then also delete its reviews, products, orders and promotions
			const productsOfStore = await Product.deleteMany({
				storeId: store._id,
			});
			const reviewsOfStoreProducts = await Review.deleteMany({
				storeId: store._id,
			});
			const ordersOfStoreProducts = await Order.deleteMany({
				storeId: store._id,
			});
			const promotionsOfStoreProducts = await PromoteProduct.deleteMany({
				storeId: store._id,
			});
			const problemReportsOfStore = await ReportProblem.deleteMany({
				sellerID: seller._id,
			});
			const orderReportsOfStore = await OrderProblemReport.deleteMany({
				storeID: store._id,
			});
			await store.remove();
		}
		await req.user.remove();

		//send deletion mail
		const subject = "Account Deletion Email";
		const message = `Your seller account registered on ${seller.email} has been removed from Digi-Mart. 
        We recieved your reason behind account deletion and our team will work on it. Our customers will miss your store
        '${storeName}' products. Hope you will soon be part of Digi-Mart family again.
        <br><strong>Thank you for your time.</strong>`;
		notification.sendNotificationMail(
			seller.email,
			subject,
			message,
			seller.name
		);

		res.status(200).json({
			message: `Account has been Deleted successfully.`,
			data: {
				user: req.user,
			},
		});
	} catch (e) {
		e.status = 500;
		next(e);
	}
};

const deActivateMyAccount = async (req, res, next) => {
	try {
		//var isStoreRegistered = false
		const seller = req.user;
		//deactivate account status
		req.user.status = "Deactivate";
		//deactivate store
		if (req.store) {
			req.store.status = "Deactivate";
			//we unpublish its all products
			const productsOfStore = await Product.find({
				storeID: req.store._id,
			});
			if (productsOfStore) {
				productsOfStore.forEach(async (product) => {
					product.isVisibilityEnabled = false;
					await product.save();
				});
			}
			//save store
			await req.store.save();
		}
		//logout
		req.user.tokens = req.user.tokens.filter((tokens) => {
			return tokens.token !== req.token;
		});
		//save user
		await req.user.save();
		//send deactivation mail
		const subject = "Account Deactivate Email";
		const message = `Your seller account registered on ${seller.email} has been deactivated temporily. 
        You can activate your account anytime by logging in from your credentials. Hope you will activate your account 
        soon again and be part of Digi-Mart family.
        <br><strong>Thank you for your time.</strong>`;
		notification.sendNotificationMail(
			seller.email,
			subject,
			message,
			seller.name
		);
		res.status(200).json({
			message: `Your account and store has been deactivated successfully.`,
			data: {
				email: req.user.email,
				//isStoreRegistered : isStoreRegistered
			},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

const activateMyAccount = async (req, res, next) => {
	try {
		//var isStoreRegistered = false;

		//if store, activate store
		if (req.store) {
			if (req.user.status == "Blocked") {
				throw new Error(
					"Sorry! Your account is blocked and it cannot be activated."
				);
			}
			//activate account status
			req.user.status = "Active";
			//save user
			await req.user.save();
			//active store
			req.store.status = "Active";
			//If products, then set its products visisble
			const productsOfStore = await Product.find({
				storeID: req.store._id,
			});
			if (productsOfStore) {
				productsOfStore.forEach(async (product) => {
					product.isVisibilityEnabled = false;
					await product.save();
				});
			}
			//save store
			await req.store.save();
		} else {
			throw new Error("Please register your store to activate account.");
		}

		res.status(200).json({
			message: `Account has been Activated successfully.`,
			data: {
				user: req.user,
				//isStoreRegistered: isStoreRegistered
			},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

const addBankDetails = async (req, res, next) => {
	try {
		const updates = Object.keys(req.body);
		//validations
		// const allowedUpdated=['routingNumber','accountNumber','bankName','AccountHolderName',
		// 'paymentMethod','isPrimaryAccount','paymentEmail','isStoreRegistered']
		// const isValidOperation=updates.every((update) => allowedUpdated.includes(update))
		// if(!isValidOperation){
		//     throw new Error('Please enter valid bank details!')
		// }
		const user = req.user;
		//check if account already exists
		let isAccountAlreadyExists = false;
		user["PaymentAccounts"].forEach((account) => {
			if (
				account.accountNumber === req.body.accountNumber &&
				account.paymentMethod === req.body.paymentMethod
			) {
				isAccountAlreadyExists = true;
			}
		});
		if (isAccountAlreadyExists) {
			throw new Error("Account already exists!");
		}
		//If primary, remove previous account from primary account
		if (req.body.isPrimaryAccount == true) {
			user["PaymentAccounts"].forEach((account) => {
				account.isPrimaryAccount = false;
			});
			await user.save();
		}
		//adding acccount in accounts array
		const addAccountDetails = await Seller.findOneAndUpdate(
			{ _id: user._id },
			{ $push: { PaymentAccounts: req.body } }
		);
		return res.status(200).json({
			message: `Payment account has been updated successfully.`,
			data: {
				email: req.user.email,
			},
		});
	} catch (e) {
		e.status = 402;
		next(e);
	}
};

const forgetAccountPassword = async (req, res, next) => {
	try {
		const email = req.body.email;
		console.log("email: ", email);
		const user = await Seller.findOne({ email: email });
		if (!user) {
			throw new Error(
				"No user with this email exists! Please enter valid email."
			);
		}
		//Generate and set password reset token
		user.generatePasswordReset();
		//save new user obj
		await user.save();
		//reset password link
		let link =
			"http://" +
			req.headers.host +
			"/seller/set-password?auth=" +
			user.resetPasswordToken;
		//send reset password link to user via. email
		notification.sendForgetPasswordMail(user.email, user.name, link);
		return res.status(200).json({
			message: `Reset password link is sent to email.`,
			data: {
				email: email,
				name: user.name,
			},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

const resetPassword = async (req, res, next) => {
	try {
		const seller = await Seller.findOne({
			resetPasswordToken: req.params.token,
			resetPasswordExpires: { $gt: Date.now() },
		});
		if (!seller) {
			throw new Error("Password reset token is invalid or has expired.");
		}

		//Set the new password
		seller.password = req.body.password;
		seller.resetPasswordToken = undefined;
		seller.resetPasswordExpires = undefined;
		//logout from all devices
		seller.tokens = [];
		//save user
		await seller.save();

		//send change password mail here
		const subject = "Account Password Updated";
		const message = `<strong>This is a confirmation mail.</strong><br>
        Your account password has been updated successfully.<br>
        `;
		notification.sendNotificationMail(
			seller.email,
			subject,
			message,
			seller.name
		);

		return res.status(200).json({
			message: `User Password has been updated successfully.You are Logged out from all devices. Sign in again by entering new password.`,
			data: {
				user: seller.email,
			},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

const updateProfile = async (req, res, next) => {
	try {
		const updates = Object.keys(req.body);
		// const allowedUpdated=['name','email','password','gender','phoneNumber','birthday','CNIC',
		// 'isStoreRegistered','profilePic','isNotificationsEnabled','isDarkModeEnabled']
		// const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
		// if(!isValidOperation || updates.length == 0){
		//     throw new Error('Invalid Keys! Please enter valid keys.')
		// }
		const user = req.user;
		if (!user) {
			throw new Error("User not found!");
		}

		//If user sets status to deactivate then remove all prodcuts
		const store = await Store.findById(user.storeId);
		if (store) {
			store.status = req.body.status;
			if (req.body.status == "Deactivate") {
				const products = await Product.find({ storeID: store._id });
				products.forEach(async (product) => {
					product.isVisibilityEnabled = false;
					await product.save();
				});
			}
			await store.save();
		}

		updates.forEach((update) => (user[update] = req.body[update]));
		await user.save();
		//send email here
		return res.status(200).json({
			message: `User Profile has been updated successfully.`,
			data: {
				user: req.user,
			},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

const getPersonalDetails = async (req, res, next) => {
	try {
		const seller = req.user;
		//console.log(seller)
		res.status(201).send({
			message: `Seller data fetched Successfully!`,
			data: {
				seller,
			},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

const getBankDetails = async (req, res, next) => {
	try {
		const seller = req.user;
		//console.log(seller)
		res.status(201).send({
			message: `Data fetched Successfully!`,
			data: {
				PaymentAccounts: seller.PaymentAccounts,
			},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

const updateBankAccountDetailsById = async (req, res, next) => {
	try {
		let isAccountIdPresent = false;
		const updates = Object.keys(req.body);
		const user = req.user;
		const updateAccountId = req.params.id;
		//find account of user using id
		user["PaymentAccounts"].forEach(async (account) => {
			if (account._id == updateAccountId) {
				//If primary, remove previous account from primary account
				if (req.body.isPrimaryAccount == true) {
					user["PaymentAccounts"].forEach((account) => {
						account.isPrimaryAccount = false;
					});
				}
				//update data of account
				isAccountIdPresent = true;
				updates.forEach(
					(update) => (account[update] = req.body[update])
				);

				await user.save();
				res.status(200).send({
					message: `Payment Account updated Successfully!`,
					data: {
						account,
					},
				});
			}
		});
		if (!isAccountIdPresent) {
			throw new Error("Account not found !");
		}
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

const deleteBankAccountById = async (req, res, next) => {
	try {
		let isAccountIdPresent = false;
		const user = req.user;
		const deleteAccountId = req.params.id;
		//find if account Id present
		user["PaymentAccounts"].forEach(async (account) => {
			if (account._id == deleteAccountId) {
				//update data of account
				isAccountIdPresent = true;
			}
		});
		if (!isAccountIdPresent) {
			throw new Error("Account not found !");
		}
		//filter account from all payment accounts and save
		user["PaymentAccounts"] = user["PaymentAccounts"].filter(function (
			account
		) {
			return account._id != deleteAccountId;
		});
		await user.save();
		res.status(200).send({
			message: `Payment Account deleted Successfully!`,
			data: {},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

const changePassword = async (req, res, next) => {
	try {
		const user = req.user;
		const oldPassword = req.body.oldPassword;
		const newPassword = req.body.newPassword;
		const isMatch = await bcrypt.compare(oldPassword, user.password);
		if (!isMatch || !oldPassword || !newPassword) {
			throw new Error("Invalid password Entered!");
		}
		//update password
		user["password"] = newPassword;
		await user.save();
		//send change password mail here
		return res.status(200).json({
			message: `User Password has been updated successfully.`,
			data: {
				user: req.user,
			},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

//ROUTES FOR ADMIN

const getTotalNumberOfSellers = async (req, res, next) => {
	try {
		const totalNumberOfSellers = await Seller.estimatedDocumentCount();
		return res.status(200).json({
			message: `Total number of Sellers fetched successfully!.`,
			data: {
				totalNumber: totalNumberOfSellers,
			},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

const getAllSellersDetails = async (req, res, next) => {
	try {
		const filters = {};
		const Sellers = await Seller.find(filters);
		return res.status(200).json({
			message: `Sellers data fetched successfully!.`,
			data: {
				Sellers: Sellers,
			},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

const registerStore = async (req, res, next) => {
	try {
		const user = req.user;
		user.isStoreRegistered = true;
		await user.save();
		return res.status(200).json({
			message: `Store registered successfully!.`,
			data: {
				user,
			},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

// const blockSellerById = async (req, res, next) => {
//     try{
//         const _id = req.params.id
//         const user = await Seller.findById(_id)
//         user.status = "Blocked"
//         await user.save()
//         return res.status(200).json({
//             message:`User blocked successfully!.`,
//             data:{
//                 user
//             }
//         })
//     }
//     catch(e){
//         e.status = 404
//         next(e)
//     }
// }

// const unblockSellerById = async (req, res, next) => {
//     try{
//         const _id = req.params.id
//         const user = await Seller.findById(_id)
//         user.status = "Active"
//         await user.save()
//         return res.status(200).json({
//             message:`User unblocked successfully!.`,
//             data:{
//                 user
//             }
//         })
//     }
//     catch(e){
//         e.status = 404
//         next(e)
//     }
// }

const editSellerById = async (req, res, next) => {
	try {
		const updates = Object.keys(req.body);
		const _id = req.params.id;
		const user = await Seller.findById(_id);
		if (!user) {
			throw new Error("User not found!");
		}
		//Update all fields acc to status
		const store = await Store.findById(user.storeId);
		if (store) {
			store.status = req.body.status;
			if (
				req.body.status == "Blocked" ||
				req.body.status == "Deactivate"
			) {
				const products = await Product.find({ storeID: store._id });
				products.forEach(async (product) => {
					product.isVisibilityEnabled = false;
					await product.save();
				});
				//logout from all devices
				user.tokens = [];
			}
			if (req.body.status == "Active") {
				const products = await Product.find({ storeID: store._id });
				products.forEach(async (product) => {
					product.isVisibilityEnabled = true;
					await product.save();
				});
			}
			await store.save();
		}

		updates.forEach((update) => (user[update] = req.body[update]));
		await user.save();
		//send email here
		return res.status(200).json({
			message: `User updated successfully.`,
			data: {
				seller: user,
			},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

const viewSellerById = async (req, res, next) => {
	try {
		const _id = req.params.id;
		const user = await Seller.findById(_id);
		if (!user) {
			throw new Error("User not found!");
		}
		return res.status(200).json({
			message: `User fetched successfully.`,
			data: {
				seller: user,
			},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

const viewAllSellersWhoseStoresNotRegistered = async (req, res, next) => {
	try {
		const users = await Seller.find({ storeId: null });
		if (!users) {
			throw new Error("User not found!");
		}
		return res.status(200).json({
			message: `Sellers whose stores are Un-registered fetched successfully.`,
			data: {
				sellers: users,
			},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

const viewAllSellersWhoseStoresAreRegistered = async (req, res, next) => {
	try {
		const users = await Seller.find({ storeId: { $ne: null } });
		if (!users) {
			throw new Error("User not found!");
		}
		return res.status(200).json({
			message: `Sellers whose stores are registered fetched successfully.`,
			data: {
				sellers: users,
			},
		});
	} catch (e) {
		e.status = 404;
		next(e);
	}
};

module.exports = {
	//for seller
	registerSeller,
	loginSeller,
	logoutSeller,
	deleteMyAccount,
	deActivateMyAccount,
	activateMyAccount,
	addBankDetails,
	forgetAccountPassword,
	updateProfile,
	getPersonalDetails,
	changePassword,
	getBankDetails,
	updateBankAccountDetailsById,
	deleteBankAccountById,
	registerStore,
	resetPassword,
	//for admin
	getAllSellersDetails,
	getTotalNumberOfSellers,
	editSellerById,
	viewSellerById,
	viewAllSellersWhoseStoresNotRegistered,
	viewAllSellersWhoseStoresAreRegistered,
};
