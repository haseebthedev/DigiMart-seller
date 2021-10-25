const Buyer = require('../../users/buyer/models/buyer.model')
const Product = require('../../products/model/product.model')
const ProductCategory = require('../../products/model/productCategories.model')
const Review = require('../../review/model/review.model')
const BuyerCustomizations = require('../../customizations/model/buyerCustomization.model')

const getIndexPageData = async (req, res, next) => {
    const TOP_REVIEWED_PRODUCTS_QUANTITY = 18
    const PRODUCTS_ON_SALE_QUANTITY = 12
    try{
        //-----BUYER INFO
        let BuyerProfileInfo = ""
        if(req.user){
            BuyerProfileInfo = await Buyer.find({_id: req.user._id})
        }
        
        //-----PRODUCT CATEGORIES INFO
        const ProductCategoriesInfo = await ProductCategory.find({})

        //-----ALL PRODUCTS
        const TopReviewedProducts = await Review.aggregate([

            {
              $group: {
                _id: "$productId",
                avgRating: {
                  $avg: "$rating"
                }
              }
            },
            {
                $sort: {
                  avgRating: -1
                }
            },
            
            {
              $project: {
                product: 1,
                averageRating: { $round: ['$avgRating', 1] }
              }
            },
            {
                $limit: TOP_REVIEWED_PRODUCTS_QUANTITY
            }

          ]).then(async (result) => {
            result.forEach(async (item) => {
                item.product = await Product.findOne({_id: item._id})
                delete item._id
            })
            return result
         });

        //-----SUB-CATEGORIES PRODUCTS COUNT
        const SubCategoriesProductCount = await Product.aggregate([
            {
              "$group": {
                "_id": {
                  "category": "$category",
                  "subCategory": "$subCategory"
                },
                "count": {
                  "$sum": 1
                }
              }
            },
            
            {
              "$sort": {
                "count": -1
              }
            }
          ]).then(result => {
            result.forEach((item) => {
                item.subcategory = item["_id"].subCategory
                item.category = item["_id"].category
                delete item["_id"]
            })
            return result
         });
     
         //-----CATEGORIES PRODUCTS COUNT
         const CategoriesProductsCount = await Product.aggregate([
            {
              "$group": {
                "_id": {
                  "category": "$category",
                },
                "count": {
                  "$sum": 1
                }
              }
            },
            {
              "$sort": {
                "count": -1
              }
            }
          ]).then(result => {
            result.forEach((item) => {
                item.category = item["_id"].category
                delete item["_id"]
            })
            return result
         });

        // PRODUCTS ON SALE
        const ProductsOnSale = await Product.find({isOnSale: true}).limit(PRODUCTS_ON_SALE_QUANTITY)
     
        res.status(200).json({
            message:`HomePage Data Fetched !`,
            data:{
                //BuyerProfileInfo,
                ProductCategoriesInfo,
                SubCategoriesProductCount,
                CategoriesProductsCount,
                TopReviewedProducts,
                ProductsOnSale
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

module.exports = {
    getIndexPageData
}