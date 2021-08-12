const Product = require('../../products/model/product.model')
const Order = require('../../orders/model/order.model')

const getAllVendorAnalytics = async(req, res, next) => {
    try{
        if(!req.store){
            throw new Error('Please register your store to view analytics !')
        }
        const storeId = req.store._id
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
        const profitOnEachProduct = await Order.aggregate([
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
                    _id: '$deliveryDate',
                     orders: { $sum: "$totalQuantity"}
                }
            },
            {$project: {date: '$_id', orders: 1, _id: 0}}
                // {$project: {date: '$_id', patients: 1, _id: 0}}
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
                profitOnEachProduct,
                productsAnalytics,
                allCounts,
                salesByDate
            }
        })

    }
    catch(e){
        e.status = 404
        next(e)
    }
}

module.exports = {
    getAllVendorAnalytics
}
