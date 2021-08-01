const PromoteProduct = require("../model/promoteProduct.model");
const validUrl = require("valid-url");
const shortid = require("shortid");

const addPromotedProduct = async (req, res, next) => {
	try {
		if (!req.store) {
			throw new Error("Please register your store to promote Product.");
		}

		req.body["storeId"] = req.store._id;
		const product = new PromoteProduct(req.body);
		await product.save();
		res.status(201).json({
			message: `Promoted product has been added successfully!`,
			data: {
				product: product,
			},
		});
	} catch (err) {
		err.status = 500;
		next(err);
	}
};

const checkIfProductPromotedBefore = async (req, res, next) => {
	try {
		const REQUIRED_DAYS_DIFFERENCE = 7;
		const productId = req.params.productId;
		const isProductPresent = await PromoteProduct.findOne({ productId });
		//if product not prsent in promoted product DB then send response OK
		console.log(isProductPresent);
		if (!isProductPresent) {
			res.status(200).json({
				message: `Product Valid For Promotion.`,
				data: {
					isProductValidForPromotion: true,
				},
			});
		} else {
			//check if product was promoted a week ago,
			//if yes start promotion again else show error message
			var todayDate = new Date();
			var productPromotionDate = isProductPresent["promotion_date"];
			//console.log(isProductPresent, productPromotionDate)
			//productPromotionDate = productPromotionDate.split("T")[0];
			var Difference_In_Time =
				todayDate.getTime() - productPromotionDate.getTime();
			var Difference_In_Days = Math.floor(
				Difference_In_Time / (1000 * 3600 * 24)
			);
			if (Difference_In_Days < REQUIRED_DAYS_DIFFERENCE) {
				res.status(200).json({
					message:
						"Sorry! you promoted this product less than " +
						REQUIRED_DAYS_DIFFERENCE +
						" days ago !",
					data: {
						isProductValidForPromotion: false,
					},
				});
			} else {
				res.status(200).json({
					message: `Product Valid For Promotion.`,
					data: {
						isProductValidForPromotion: true,
					},
				});
			}
		}
	} catch (err) {
		err.status = 404;
		next(err);
	}
};

const scheduleProductPromotion = async (req, res, next) => {
	try {
		if (!req.store) {
			throw new Error("Please register your store to promote Product.");
		}

		req.body["storeId"] = req.store._id;
		req.body["isPromotionScheduled"] = true;
		const product = new PromoteProduct(req.body);
		await product.save();
		res.status(201).json({
			message: `Product promotion scheduled successfully!`,
			data: {
				product: product,
			},
		});
	} catch (err) {
		err.status = 404;
		next(err);
	}
};

const editScheduledPromotionById = async (req, res, next) => {
	try {
		const updates = Object.keys(req.body);
		const _id = req.params.id;
		const promotion = await PromoteProduct.findById(_id);
		if (promotion.length == 0) {
			throw new Error("Scheduled Product Promotion not found !");
		}
		updates.forEach((update) => (promotion[update] = req.body[update]));
		await promotion.save();
		res.status(200).json({
			message: `Product promotion schedule updated successfully!`,
			data: {
				promotion,
			},
		});
	} catch (err) {
		err.status = 404;
		next(err);
	}
};

const deleteScheduledPromotionById = async (req, res, next) => {
	try {
		const _id = req.params.id;
		const promotion = await PromoteProduct.findOneAndDelete({ _id: _id });
		if (promotion.length == 0) {
			throw new Error("Scheduled Product Promotion not found !");
		}
		res.status(200).json({
			message: `Product promotion deleted successfully!`,
			data: {
				promotion,
			},
		});
	} catch (err) {
		err.status = 404;
		next(err);
	}
};

const viewScheduledPromotionById = async (req, res, next) => {
	try {
		const _id = req.params.id;
		const promotion = await PromoteProduct.find({ _id: _id });
		if (promotion.length == 0) {
			throw new Error("Scheduled Product Promotion not found !");
		}
		res.status(200).json({
			message: `Product promotion fetched successfully!`,
			data: {
				promotion,
			},
		});
	} catch (err) {
		err.status = 404;
		next(err);
	}
};

const getScheduledPromotionsOfStore = async (req, res, next) => {
	try {
		const promotions = await PromoteProduct.find({
			isPromotionScheduled: true,
			storeId: req.store._id,
		});
		res.status(201).json({
			message: `Promotions fetched successfully!`,
			data: {
				promotions,
			},
		});
	} catch (err) {
		err.status = 404;
		next(err);
	}
};

const getPromotedProductsOfStore = async (req, res, next) => {
	try {
		const productPromotions = await PromoteProduct.find({
			isPromotionScheduled: false,
			storeId: req.store._id,
		});
		res.status(201).json({
			message: `Product Promotions fetched successfully!`,
			data: {
				productPromotions,
			},
		});
	} catch (err) {
		err.status = 404;
		next(err);
	}
};

const getAllPromotedProducts = async (req, res, next) => {
	try {
		const productPromotions = await PromoteProduct.find({
			isPromotionScheduled: false,
		});
		res.status(201).json({
			message: `Promoted products fetched successfully!`,
			data: {
				productPromotions,
			},
		});
	} catch (err) {
		err.status = 404;
		next(err);
	}
};

const generateShortURL = async (req, res, next) => {
	try {
		const { longUrl } = req.body;
		const baseUrl = process.env.BASE_URL;
		// check base url if valid using the validUrl.isUri method
		if (!validUrl.isUri(baseUrl)) {
			throw new Error("Invalid base URL");
		}
		if (!validUrl.isUri(longUrl)) {
			throw new Error("Invalid longUrl");
		}
		//we check if URL is already present in DB
		let url = await PromoteProduct.findOne({
			longUrl,
		});
		if (url) {
			res.status(200).json({
				message: `short URL already created!`,
				data: {
					shortUrl: url.shortUrl,
					isUrlAlreadyCreated: true,
				},
			});
		} else {
			// if valid, we create the url code
			const urlCode = shortid.generate();
			// join the generated short code the the base url
			const shortUrl = baseUrl + "/" + urlCode;
			res.status(201).json({
				message: `URL created successfully!`,
				data: {
					longUrl,
					shortUrl,
					urlCode,
					isUrlAlreadyCreated: false,
				},
			});
		}
	} catch (err) {
		err.status = 404;
		next(err);
	}
};

const redirectToLongUrl = async (req, res, next) => {
	try {
		// find a document match to the code in req.params.code
		const url = await PromoteProduct.findOne({
			urlCode: req.params.code,
		});
		if (url) {
			// when valid we perform a redirect
			return res.redirect(url.longUrl);
		} else {
			// else return a not found 404 status
			return res.status(404).json("No URL Found !");
		}
	} catch (err) {
		// exception handler
		console.error(err);
		res.status(500).json("Server Error");
	}
};

module.exports = {
	//FOR VENDOR
	addPromotedProduct,
	checkIfProductPromotedBefore,
	scheduleProductPromotion,
	getScheduledPromotionsOfStore,
	getPromotedProductsOfStore,
	generateShortURL,
	redirectToLongUrl,
	editScheduledPromotionById,
	deleteScheduledPromotionById,
	viewScheduledPromotionById,
	//FOR ADMIN
	getAllPromotedProducts,
};
