const Buyer = require("../../users/buyer/models/buyer.model");
const Product = require("../../products/model/product.model");
const ProductCategory = require("../../products/model/productCategories.model");
const Review = require("../../review/model/review.model");

const getIndexPageData = async (req, res, next) => {
  const TOP_REVIEWED_PRODUCTS_QUANTITY = 18;
  const PRODUCTS_ON_SALE_QUANTITY = 12;
  try {
    //-----BUYER INFO
    let BuyerProfileInfo = "";
    if (req.user) {
      BuyerProfileInfo = await Buyer.find({ _id: req.user._id });
    }

    //-----PRODUCT CATEGORIES INFO
    const ProductCategoriesInfo = await ProductCategory.find({});

    //-----TOP REVIEWED PRODUCTS
    const TopReviewedProducts = await Product.getFilteredProducts(
      {},
      0,
      TOP_REVIEWED_PRODUCTS_QUANTITY
    );

    //-----SUB-CATEGORIES PRODUCTS COUNT
    const SubCategoriesProductCount = await Product.aggregate([
      {
        $group: {
          _id: {
            category: "$category",
            subCategory: "$subCategory",
          },
          count: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          count: -1,
        },
      },
    ]).then((result) => {
      result.forEach((item) => {
        item.subcategory = item["_id"].subCategory;
        item.category = item["_id"].category;
        delete item["_id"];
      });
      return result;
    });

    //-----CATEGORIES PRODUCTS COUNT
    const CategoriesProductsCount = await Product.aggregate([
      {
        $group: {
          _id: {
            category: "$category",
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]).then((result) => {
      result.forEach((item) => {
        item.category = item["_id"].category;
        delete item["_id"];
      });
      return result;
    });

    // PRODUCTS ON SALE
    const ProductsOnSale = await Product.getFilteredProducts(
      {
        isOnSale: true,
      },
      0,
      PRODUCTS_ON_SALE_QUANTITY
    );

    res.status(200).json({
      message: `HomePage Data Fetched !`,
      data: {
        //BuyerProfileInfo,
        ProductCategoriesInfo,
        SubCategoriesProductCount,
        CategoriesProductsCount,
        TopReviewedProducts,
        ProductsOnSale,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

module.exports = {
  getIndexPageData,
};
