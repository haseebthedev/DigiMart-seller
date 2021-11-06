const mongoose = require("mongoose");
const validator = require("validator");
var uniqueValidator = require("mongoose-unique-validator");
const Order = require("../../orders/model/order.model");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
    },
    //drop down
    category: {
      type: String,
      //required: [true,'Please select category of product.']
    },
    //drop down
    subCategory: {
      type: String,
      //required: [true,'Please select category of product.']
    },
    description: {
      type: String,
      //required:[true,'Please enter product description.']
    },
    manufactureDate: {
      type: String,
      //required: [true,'Please enter product manufacture date.']
    },
    stockAvailable: {
      type: Number,
      //required: [true,'Please enter available stock of this product.']
    },
    //price on which product is purchased
    purchasePrice: {
      type: Number,
      //required:[true,'Please enter price of product.']
    },
    //price on which product is saled
    salePrice: {
      type: Number,
      //required:[true,'Please enter price of product.']
    },
    //drop down of cm, inch etc.
    dimensions: {
      type: String,
    },
    shippingCost: {
      type: Number,
    },
    //drop down
    //(e.g new , used, refurbed)
    state: {
      type: String,
    },
    //switch
    isOnSale: {
      type: Boolean,
      default: false,
    },
    //calculated when entered discount percentage automatically
    discountPrice: {
      type: Number,
    },
    //drop down weight units
    weight: {
      type: String,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    //drop down
    warranty: {
      type: String,
      default: "Check warranty.",
    },
    images: {
      type: [String],
      //required: [true,'Please upload product image.']
    },
    //drop down
    colors: {
      type: [String],
    },
    isVisibilityEnabled: {
      type: Boolean,
      default: true,
    },
    //refrences of store
    storeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      //required: true
    },
    storeName: {
      type: String,
    },
    //refrences of seller
    sellerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      //required: true
    },
    sellerName: {
      type: String,
    },
    //Vendor details
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    vendorCompanyName: {
      type: String,
    },
    vendorCategory: {
      type: String,
    },
    vendorTypeOfBusiness: {
      type: String,
    },
    isAuthenticVendorProduct: {
      type: Boolean,
      default: false,
    },
  },
  {
    //to create track of when was created or updated
    timestamps: true,
  }
);

//get Size of collection
productSchema.statics.getStorageDetails = async function () {
  const Size = await Product.collection.stats({ scale: 1024 });
  return Size.totalSize;
};

productSchema.statics.getFilteredProducts = async function (
  filters,
  page,
  limit
) {
  filters.isVisibilityEnabled = true;
  const products = await Product.aggregate([
    {
      $match: filters,
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "productId",
        as: "review",
      },
    },
    {
      $addFields: {
        avgRating: {
          $avg: "$review.rating",
        },
        totalRatingStars:{
          $sum: "$review.rating",
        },
        totalReviews:"$review._id",
        images: {$first: "$images"},
        // countOfRating1: {
        //   $sum: {
        //     "$eq": ["$review.rating", "4"],
        //   },
        // },
      },
    },
    {
      $project: {
        name: 1,
        // isOnSale: 1,
        discountPercentage: 1,
        salePrice: 1,
        discountPrice: 1,
        avgRating: 1,
        category: 1,
        subCategory: 1,
        // vendorCompanyName: 1,
        // purchasePrice: 1,
        salePrice: 1,
        shippingCost: 1,
        // state: 1,
        // stockAvailable: 1,
        images: 1,
        createdAt: 1,
        ratingCount: 1,
        // countOfRating1: 1,
        totalRatingStars:1,
        // storeID:1,
        // totalReviewsCount:1,
        // totalReviews:1
      },
    },
    { $skip: page * limit },
    { $limit: limit },
    {
      $sort: {
        // avgRating: -1,
        totalRatingStars: -1
      },
    },
  ]).then(async (result) => {
    return result;
  });
  return products;
};

productSchema.statics.getProductDetails = async function (
  filters,
  page,
  limit
) {
  filters.isVisibilityEnabled = true;
  const products = await Product.aggregate([
    {
      $match: filters,
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "productId",
        as: "review",
      },
    },
    {
      $addFields: {
        avgRating: {
          $avg: "$review.rating",
        },
        totalRatingStars:{
          $sum: "$review.rating",
        },
        // countOfRating1: {
        //   $sum: {
        //     "$eq": ["$review.rating", "4"],
        //   },
        // },
      },
    },
    {
      $project: {
        name: 1,
        isOnSale: 1,
        discountPercentage: 1,
        salePrice: 1,
        discountPrice: 1,
        avgRating: 1,
        category: 1,
        subCategory: 1,
        vendorCompanyName: 1,
        purchasePrice: 1,
        salePrice: 1,
        shippingCost: 1,
        state: 1,
        stockAvailable: 1,
        images: 1,
        createdAt: 1,
        ratingCount: 1,
        countOfRating1: 1,
        sellerID:1,
        colors:1,
        weight:1,
        manufactureDate:1,
        description:1,
        warranty:1,
        isAuthenticVendorProduct:1,
        vendorCategory:1,
        dimensions:1,
        totalRatingStars:1
      },
    },
    { $skip: page * limit },
    { $limit: limit },
    {
      $sort: {
        // avgRating: -1,
        totalRatingStars: -1
      },
    },
  ]).then(async (result) => {
    return result;
  });
  return products;
};


productSchema.statics.getTopSellingProducts = async function (
  filters,
  page,
  limit
) {
  //here i am getting all products Id's according to filters applied i.e category, subcategory
  //so i can pass them in match of reviews filters
  const tempProductsIds = await Product.find(filters).select({ _id: 1 });
  const productIds = [];
  tempProductsIds.forEach((product) => {
    productIds.push(product._id);
  });
  const TopSellingProducts = await Order.aggregate([
    {
      $match: {
        status: "Delivered",
        "products.productId": { $in: productIds },
      },
    },
    {
      $unwind: {
        path: "$products",
      },
    },
    {
      $replaceRoot: {
        newRoot: "$products",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: {
        path: "$product",
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "product._id",
        foreignField: "productId",
        as: "review",
      },
    },
    {
      $group: {
        _id: "$productId",
        name: { $first: "$product.name" },
        isOnSale: { $last: "$product.isOnSale" },
        discountPercentage: { $last: "$product.discountPercentage" },
        salePrice: { $last: "$product.salePrice" },
        discountPrice: { $last: "$product.discountPrice" },
        category: { $last: "$product.category" },
        subCategory: { $last: "$product.subCategory" },
        vendorCompanyName: { $last: "$product.vendorCompanyName" },
        purchasePrice: { $last: "$product.purchasePrice" },
        salePrice: { $last: "$product.salePrice" },
        shippingCost: { $last: "$product.shippingCost" },
        state: { $last: "$product.state" },
        stockAvailable: { $last: "$product.stockAvailable" },
        images: {$first: "$product.images"},
        createdAt: { $last: "$product.createdAt" },
        avgRating: {
          $last: { $avg: "$review.rating" },
        },
        totalRatingStars:{
          $sum: "$review.rating",
        },
        reviews: { $last: "$review._id" },
        totalQuantity: {
          $sum: "$quantity",
        },
        totalOrders: {
          $sum: 1,
        },
      },
    },
    { $skip: page * limit },
    { $limit: limit },
    {
      $sort: {
        totalOrders: -1,
      },
    },
  ]);

  return TopSellingProducts;
};

productSchema.plugin(uniqueValidator, { message: "{PATH} already exists!" });
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
