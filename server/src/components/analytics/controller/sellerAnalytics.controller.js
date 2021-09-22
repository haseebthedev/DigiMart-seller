const Product = require('../../products/model/product.model')
const Order = require('../../orders/model/order.model')
const Review = require('../../review/model/review.model')
const mongoose = require("mongoose");

const getAllSellerAnalytics = async(req, res, next) => {
    try{
        const TOP_REVIEWED_PRODUCTS_QUANTITY = 12
        const NUM_OF_DOCUMENTS = 5
        const TOP_SELLED_PRODUCTS_QUANTITY = 12
        let storeId = ""
        if(!req.store && !req.params.id){
            throw new Error('Please register your store to view analytics !')
        }
        //for store analytics of admin
        if(req.params.id){
          storeId = req.params.id
        }
        //for user's own store
        if(req.store){
          storeId = req.store._id
        }
        //aggregates
        const productsAnalytics = await Product.aggregate([
            { $match: { 
                stockAvailable: {$gte: 0},
                purchasePrice: {$gte: 0}, 
                storeID: storeId } 
            },
            { $group: { 
                _id: null,
                totalStock: { $sum: "$stockAvailable" },
                totalPurchasePrice: { $sum: {$multiply: ["$purchasePrice", "$stockAvailable" ]}},
                totalSalePrice: { $sum: {$multiply: ["$salePrice", "$stockAvailable" ]}},
                }
            }
        ])

        const ordersAnalytics = await Order.aggregate([
            { $match: { 
                totalPrice: {$gte: 0},
                storeId: storeId,
                status: "Delivered" }
            },
            { $group: { 
                _id: null,
                totalRevenue: { $sum: "$totalPrice"},
                totalPurchasePrice: {$sum: "$totalPurchasePrice"},
                }
            },
            { $addFields: {
                 totalProfit: { $subtract: ["$totalRevenue" , "$totalPurchasePrice"]} 
                }
            }
        ])
        const profitOnEachOrder = await Order.aggregate([
            { $match: { 
                totalPrice: {$gte: 0},
                storeId: storeId,
                status: "Delivered" 
                }
            },
            { $project: { 
                Profit: { $subtract: ["$totalPrice" , "$totalPurchasePrice"]}
                }
            }
        ])
        //counts
        const today = new Date().toISOString().replace('T', ' ').substring(0, 19)
        const todayDeliveredOrdersCount = await Order.countDocuments({deliveryDate: {$gte: today},status: "Delivered", storeId: storeId})
        const totalDeliveredOrdersCount = await Order.countDocuments({storeId: storeId, status:"Delivered"})
        const totalCancelledOrdersCount = await Order.countDocuments({storeId: storeId, status:"Cancelled"})
        const totalReturnedOrdersCount = await Order.countDocuments({storeId: storeId, status:"Returned"})
        const totalActiveOrdersCount = await Order.countDocuments({storeId: storeId, status:"Active"})
        const totalPendingOrdersCount = await Order.countDocuments({storeId: storeId, status:"Pending"})

        //Lists
        const salesByDate = await Order.aggregate([
            { $match: {
                storeId: storeId,
                status: "Delivered" }
            },
            { $group: 
                {
                  _id: {$substr : ["$createdAt", 0,10]},
                  orders: { $sum: 1},
                }
            },
            {$project: {date: '$_id', orders: 1, _id: 0}}
                // {$project: {date: '$_id', patients: 1, _id: 0}}
        ])

        const recentPendingOrders = await Order.find({storeId: storeId, status:"Pending"})
        .sort({ _id: -1 }).limit(NUM_OF_DOCUMENTS)
        const recentDeliveredOrders = await Order.find({storeId: storeId, status:"Delivered"})
        .sort({ _id: -1 }).limit(NUM_OF_DOCUMENTS)
        const highestAmountOrders = await Order.find({storeId: storeId, status:"Delivered"})
        .sort({ totalPrice: -1 }).limit(NUM_OF_DOCUMENTS).select('products')

        //TOP REVIWED PRODUCTS OF STORE
        //TOP REVIEWED PRODUCTS
        const productIdsAndRating = await Review.aggregate([
          { $match: {
            storeId: storeId
           }
          },
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
              "product": "$product",
              "averageRating": { $round: ['$avgRating', 1] }
            }
          },

        ]).then(async (result) => {
          return result
       });
       //seperating productID from rating
       let productIds = []
       
       productIdsAndRating.forEach((item) => {
           if(mongoose.Types.ObjectId.isValid(item._id))
           productIds.push(item._id.toString())
       })
      
       //finding products with those ids
       const products = await Product.find({_id: {$in: productIds}})
       .limit(TOP_REVIEWED_PRODUCTS_QUANTITY)
       
       //pushing product and its rating in same object
       let topReviewedProductsAndAvgRating = []
       products.forEach((product, index) => {
           topReviewedProductsAndAvgRating.push({
               product: product,
               avgRating: productIdsAndRating[index].averageRating
           })
       })

      const topSellingProducts = await Order.aggregate([
            {
              "$match": {
                "$expr": {
                  "$and": [
                    {
                      "$eq": [
                        "$storeId",
                        storeId
                      ]
                    },
                    {
                      "$eq": [
                        "$status",
                        "Delivered"
                      ]
                    }
                  ]
                }
              }
            },
            {
              "$unwind": {
                "path": "$products"
              }
            },
            {
              "$replaceRoot": {
                "newRoot": "$products"
              }
            },
            {
              "$group": {
                "_id": {
                  "productId": "$productId",
                  "productName": "$name"
                },
                "count": {
                  "$sum": "$quantity"
                }
              }
            },
            { "$limit" : TOP_SELLED_PRODUCTS_QUANTITY },
            {
              "$sort": {
                "count": -1
              }
            }
          ])
        
        const allCounts = {
            todayDeliveredOrdersCount,
            totalDeliveredOrdersCount,
            totalCancelledOrdersCount,
            totalReturnedOrdersCount,
            totalActiveOrdersCount,
            totalPendingOrdersCount
        }

        res.status(200).json({
            message:`Seller Analytics fetched !`,
            data:{
                ordersAnalytics,
                profitOnEachProduct: profitOnEachOrder,
                productsAnalytics,
                allCounts,
                salesByDate,
                recentDeliveredOrders,
                recentPendingOrders,
                topReviewedProductsAndAvgRating,
                topSellingProducts,
            }
        })

    }
    catch(e){
        e.status = 404
        next(e)
    }
}

module.exports = {
    getAllSellerAnalytics
}
