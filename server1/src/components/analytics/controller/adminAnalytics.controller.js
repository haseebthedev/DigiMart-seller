const Seller = require('../../users/seller/models/seller.model')
const Buyer = require('../../users/buyer/models/buyer.model')
const Admin = require('../../users/super-admin/models/superAdmin.model')
const Store = require('../../store/model/store.model')
const Product = require('../../products/model/product.model')
const VendorProduct = require('../../products/model/vendorProduct.model')
const Review = require('../../review/model/review.model')
const Order = require('../../orders/model/order.model')
const PromotedProducts = require('../../promotion/model/promoteProduct.model')
const PromotionAudience = require('../../promotion/model/promotionAudience.model')
const SystemProblems = require('../../reportProblem/model/report.model')
const OrderProblems = require('../../reportProblem/model/orderReport.model')
const Vendor = require('../../vendor/model/vendor.model')
const AdminCustomizations = require('../../customizations/model/superAdminCustomization.model')
const SellerCustomizations = require('../../customizations/model/sellerCustomization.model')
const BuyerCustomizations = require('../../customizations/model/buyerCustomization.model')
const OrderProblemSubjects = require('../../reportProblem/model/orderReportSubject.model')
const VendorCategories = require('../../vendor/model/vendorCategory.model')
const Productcategories = require('../../products/model/productCategories.model')

const getAllSystemAnalytics = async(req, res, next) => {
    try{
        const TOP_REVIEWED_PRODUCTS_QUANTITY = 12
            //STORAGE DETAILS
            const sellerSize = await Seller.getStorageDetails() + await SellerCustomizations.getStorageDetails()
            const buyerSize = await Buyer.getStorageDetails() + await BuyerCustomizations.getStorageDetails()
            const adminSize = await Admin.getStorageDetails() + await AdminCustomizations.getStorageDetails()
            const storeSize = await Store.getStorageDetails()
            const vendorSize = await Vendor.getStorageDetails() + await VendorCategories.getStorageDetails()
            const storeProductSize = await Product.getStorageDetails() + await Productcategories.getStorageDetails()
            const vendorProductSize = await VendorProduct.getStorageDetails()
            const reviewSize = await Review.getStorageDetails()
            const ordersSize = await Order.getStorageDetails() + await OrderProblemSubjects.getStorageDetails()
            const promotionAudienceSize = await PromotionAudience.getStorageDetails()
            const promotedProductsSize = await PromotedProducts.getStorageDetails()
            const orderProblemsReportsSize = await OrderProblems.getStorageDetails()
            const systemProblemReports = await SystemProblems.getStorageDetails()
            //get total Size
            const occupiedSpace = sellerSize + buyerSize + adminSize + storeSize + storeProductSize +
            vendorProductSize+ vendorSize + reviewSize + ordersSize + promotionAudienceSize + 
            promotedProductsSize + orderProblemsReportsSize + systemProblemReports + ' KB'
            const totalSpace = '560 MB'

            //TOTAL BUYERS
            const totalNumberOfBuyers = await Buyer.estimatedDocumentCount()

            //TOTAL ACTIVE STORES
            const totalActiveNumberOfStores = await Store.estimatedDocumentCount({status: "Avtive"})

            //TOTAL SELLERS
            const totalNumberOfSellers = await Seller.estimatedDocumentCount()

            //TOTAL VENDORS
            const totalNumberOfVendors = await Vendor.estimatedDocumentCount()

            //TOTAL PENDING STORE APPROVALS
            const totalNumberOfPendingStoreApprovals = await Seller.estimatedDocumentCount({status: "Pending"})

            //TOTAL NUMBER OF ACTIVE PRODUCTS
            const totalNumberOfActiveStoreProducts = await Product.estimatedDocumentCount({isVisibilityEnabled: true})

            //TOTAL NUMBER PRODUCTS ON SYSTEM
            const totalNumberOfStoreProducts = await Product.estimatedDocumentCount({})

            //TOTAL NUMBER OF ACTIVE VENDOR PRODUCTS
            const totalNumberOfActiveVendorProducts = await VendorProduct.estimatedDocumentCount({isVisibilityEnabled: true})

            //TOTAL NUMBER OF VENDOR PRODUCTS
            const totalNumberOfVendorProducts = await VendorProduct.estimatedDocumentCount({isVisibilityEnabled: true})

            //ORDERS COUNT
            //counts
            const today = new Date().toISOString().replace('T', ' ').substring(0, 19)
            const todayDeliveredOrdersCount = await Order.countDocuments({deliveryDate: {$gte: today},status: "Delivered"})
            const totalDeliveredOrdersCount = await Order.countDocuments({ status:"Delivered"})
            const totalCancelledOrdersCount = await Order.countDocuments({ status:"Cancelled"})
            const totalReturnedOrdersCount = await Order.countDocuments({ status:"Returned"})
            const totalActiveOrdersCount = await Order.countDocuments({ status:"Active"})
            const totalPendingOrdersCount = await Order.countDocuments({ status:"Pending"})


            const allCounts = {
                totalNumberOfBuyers,
                totalActiveNumberOfStores,
                totalNumberOfSellers,
                totalNumberOfVendors,
                totalNumberOfPendingStoreApprovals,
                totalNumberOfActiveStoreProducts,
                totalNumberOfStoreProducts,
                totalNumberOfActiveVendorProducts,
                totalNumberOfVendorProducts,

                //orders
                todayDeliveredOrdersCount,
                totalDeliveredOrdersCount,
                totalCancelledOrdersCount,
                totalReturnedOrdersCount,
                totalActiveOrdersCount,
                totalPendingOrdersCount
            }


            //TOP REVIEWED PRODUCTS
            const productIdsAndRating = await Review.aggregate([
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
                {$set: {
                    productId:{
                      $toObjectId:"$productId"
                    }
                 }
                },
                {
                    $lookup: {
                          from: "Product",
                          localField: "productId",
                          foreignField: "_id",
                          as: "product"
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
                 productIds.push(item._id)
             })
             //finding products with those ids
             const products = await Product.find({_id: productIds})
             .limit(TOP_REVIEWED_PRODUCTS_QUANTITY)
             //pushing product and its rating in same object
             let topReviewedProductsAndAvgRating = []
             products.forEach((product, index) => {
                 topReviewedProductsAndAvgRating.push({
                     product: product,
                     avgRating: productIdsAndRating[index].averageRating
                 })
             })

             //ORDER ANALYTICS
             const ordersAnalytics = await Order.aggregate([
                { $match: { 
                    totalPrice: {$gte: 0},
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
            if(ordersAnalytics.length == 0){
                ordersAnalytics.push({
                  totalRevenue : 0,
                  totalPurchasePrice : 0,
                  totalProfit : 0
                })
            }

        //STORE PRODUCTS ANALYTICS
        const storesProductsAnalytics = await Product.aggregate([
            { $match: { 
                stockAvailable: {$gte: 0},
                purchasePrice: {$gte: 0}, 
                } 
            },
            { $group: { 
                _id: null,
                totalStock: { $sum: "$stockAvailable" },
                totalPurchasePrice: { $sum: {$multiply: ["$purchasePrice", "$stockAvailable" ]}},
                totalSalePrice: { $sum: {$multiply: ["$salePrice", "$stockAvailable" ]}},
                }
            }
        ])

        //VENDOR PRODUCTS ANALYTICS
        const vendorsProductsAnalytics = await VendorProduct.aggregate([
            { $match: { 
                stockAvailable: {$gte: 0},
                purchasePrice: {$gte: 0}, 
                } 
            },
            { $group: { 
                _id: null,
                totalStock: { $sum: "$stockAvailable" },
                totalPurchasePrice: { $sum: {$multiply: ["$purchasePrice", "$stockAvailable" ]}},
                totalSalePrice: { $sum: {$multiply: ["$salePrice", "$stockAvailable" ]}},
                }
            }
        ])

        //LISTS
        //SALES BY DATE
        const salesListByDate = await Order.aggregate([
            { $match: {
                status: "Delivered" }
            },
            { $group: 
                {
                    _id: '$deliveryDate',
                     orders: { $sum: "$totalQuantity"}
                }
            },
            {$project: {date: '$_id', orders: 1, _id: 0}}
                // {$project: {date: '$_id', patients: 1, _id: 0}}
        ])

            return res.status(200).json({
                message:`Total size in KB's fetched successfully!.`,
                data:{
                    storage: {
                        occupiedSpace,
                        totalSpace,
                        sellerSize,
                        buyerSize,
                        adminSize,
                        storeSize,
                        storeProductSize,
                        vendorSize,
                        vendorProductSize,
                        reviewSize,
                        ordersSize,
                        promotionAudienceSize,
                        promotedProductsSize,
                        orderProblemsReportsSize
                    },
                    allCounts,
                    topReviewedProductsAndAvgRating,
                    totalRevenueOfAllStores: ordersAnalytics[0].totalRevenue,
                    totalPurchasePriceOfAllStores: ordersAnalytics[0].totalPurchasePrice,
                    totalProfitOfAllStores: ordersAnalytics[0].totalProfit,
                    salesListByDate,
                    storesProductsAnalytics,
                    vendorsProductsAnalytics
                }
            })
        
    }
    catch(e){
        e.status = 404
        next(e)
    }
}
module.exports = {
    getAllSystemAnalytics
}