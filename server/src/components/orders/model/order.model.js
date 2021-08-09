const mongoose = require("mongoose");
const validator = require("validator");
var uniqueValidator = require("mongoose-unique-validator");

const orderSchema = new mongoose.Schema(
	{
		products: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				name: {
					type: String,
				},
				buyPrice: {
					type: Number,
					required: true,
				},
				//discount if any on product
				discount: {
					type: Number,
				},
				quantity: {
					type: Number,
					default: 1,
				},
				size: {
					type: String,
				},
				color: {
					type: String,
				},
			},
		],
		storeId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Store",
			required: true,
		},
		buyerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Buyer",
		},
		name: {
			type: String,
			required: [true, "Please enter your name in name field!"],
			validate(str) {
				if (!validator.isByteLength(str, { min: 3, max: 30 })) {
					throw new Error(
						"Name must be between 3 to 30 characters long!"
					);
				}
			},
		},
		deliveryAddress1: {
			type: String,
			required: true,
		},
		deliveryAddress2: {
			type: String,
		},
		contactNumber: {
			type: String,
			required: true,
			validate(str) {
				var regExpNumber =
					/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
				if (!str.match(regExpNumber)) {
					throw new Error("Please enter valid phone number!");
				}
			},
		},
		email: {
			type: String,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Please enter valid email!");
				}
			},
		},
		//that are pending, cancelled, completed, returned and active
		status: {
			type: String,
			default: "Pending",
			enum: ["Pending", "Cancelled", "Returned", "Active", "Delivered"],
		},
		couponCode: {
			type: String,
		},
		//discount on total price
		totalDiscount: {
			type: Number,
		},
		orderDateTime: {
			type: Date,
			default: Date.now(),
		},
		deliveryDate: {
			type: Date,
		},
		deliveryTime: {
			type: String,
		},
		//total without delivery fee
		subTotalPrice: {
			type: Number,
			required: true,
		},
		//total with delivery fee
		totalPrice: {
			type: Number,
			required: true,
		},
		shippingFee: {
			type: Number,
			required: true,
		},
		deliveryInstructions: {
			type: String,
		},
	},
	{
		//to create track of when was created or updated
		timestamps: true,
	}
);

//get Size of collection
orderSchema.statics.getStorageDetails = async function () {
	const Size = await Order.collection.stats({ scale: 1024 });
	return Size.totalSize;
};

orderSchema.plugin(uniqueValidator, { message: "{PATH} already exists!" });
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
