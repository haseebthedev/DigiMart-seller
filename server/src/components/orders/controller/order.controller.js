const Order = require('../model/order.model')
const Product = require('../../products/model/product.model')
const Buyer = require('../../users/buyer/models/buyer.model')
const mongoose=require('mongoose')

//for buyer
const addOrder = async(req, res, next) => {
    //FOR FRONTEND:
    //first add all orders that buyer placed from different stores, in an array after buyer place order.
    //Then call api addOrder, on each items of orders Array, It will add each store order seperately.
    //Condition: if two products orders are from same store then combine them in array and call addorderAPI.
    try{
        if(req.user){
            req.body.buyerId = req.user._id
        }
        const order = new Order(req.body)
        await order.save() 
        res.status(201).json({
            message:`Order Placed !`,
            data:{
                order
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const viewOrdersPlacedByMe = async(req, res, next) => {
    try{
        
        const orders = await Order.find({buyerId: req.user._id})
        res.status(200).json({
            message:`Orders Fetched !`,
            data:{
                orders
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getOrdersPlacedByMeByOrderStatus = async(req, res, next) => {

    try{
        const userId = req.user._id
        const status = req.params.status
        const orders = await Order.find({buyerId: userId, status: status})
        res.status(200).json({
            message:`Buyer ${status} Orders Fetched !`,
            data:{
                orders
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getMyOrderDetailsById = async(req, res, next) => {

    try{
        const _id = req.params.id
        const order = await Order.findOne({_id, buyerId: req.user._id})
        res.status(200).json({
            message:`Order Fetched !`,
            data:{
                order
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

//for vendor
const updateOrderById = async(req, res, next) => {

    try{
        
        const updates = Object.keys(req.body)
        const _id = req.params.id
        const order = await Order.findById(_id)
        //check id order is delivered then subtract it from product available stock
        if(req.body.status == "Delivered"){
            let myProduct = ""
            order.products.forEach(async(product) => {
                myProduct = await Product.findOne({_id: product.productId})
                if(myProduct){
                    if(myProduct.stockAvailable){
                        myProduct.stockAvailable = myProduct.stockAvailable - product.quantity
                        // if(myProduct.stockAvailable <= 0){
                        //     throw new Error('Ordered quantity is more than the available stock of product !')
                        // }
                        await myProduct.save()
                    }
                }
                
            })
        }
        updates.forEach((update) => {
            order[update] = req.body[update]
        })
        await order.save()
        res.status(200).json({
            message:`Order Updated !`,
            data:{
                order
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const updateOrderedProductById = async(req, res, next) => {
    try{
        const updates = Object.keys(req.body)
        const _id = req.params.id
        const order = await Order.findOne({ "products._id": _id  })
        //we dont know which fields were updated by vendor so we do it dynamically
        order.products.forEach((product) => {
            if(product._id == _id){
                updates.forEach((update) => {
                    product[update] = req.body[update]
                })
            } 
        })
        await order.save()
        res.status(200).json({
            message:`Ordered product Updated !`,
            data:{
                order
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const deleteOrderedProductById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const order = await Order.findOne({ "products._id": _id  })
        order.products = order.products.filter((product) => {
            return product._id != _id
        })
        await order.save()
        res.status(200).json({
            message:`Ordered product deleted !`,
            data:{
                order
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const deleteOrderById = async(req, res, next) => {

    try{
        const _id = req.params.id
        const order = await Order.findOneAndDelete(_id)
        res.status(200).json({
            message:`Order Deleted !`,
            data:{
                order
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getOrderDetailsById = async(req, res, next) => {

    try{
        const _id = req.params.id
        const order = await Order.findById(_id)
        res.status(200).json({
            message:`Order Fetched !`,
            data:{
                order
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getOrdersOfMyStoreByStatus = async(req, res, next) => {

    try{
        const storeId = req.store._id
        const status = req.params.status
        const orders = await Order.find({storeId: storeId, status: status})
        res.status(200).json({
            message:`Store ${status} Orders Fetched !`,
            data:{
                orders
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllOrdersOfMyStore = async(req, res, next) => {

    try{
        if(!req.store){
            throw new Error('Please register your store first !')
        }
        const storeId = req.store._id
        const orders = await Order.find({storeId: storeId})
        res.status(200).json({
            message:`Store Orders Fetched !`,
            data:{
                orders
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const countTotalSalesOfStore= async(req, res, next) => {
    try{
        const storeId = req.store._id
        const sales = await Order.countDocuments({storeId: storeId, status:"Delivered"})

        res.status(200).json({
            message:`Count of Sales Fetched !`,
            data:{
                sales
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const countMyStoreOrderssByStatus = async(req, res, next) => {
    try{
        const storeId = req.store._id
        const status = req.params.status
        const orders = await Order.countDocuments({storeId: storeId, status:status})

        res.status(200).json({
            message:`Count of ${status} orders Fetched !`,
            data:{
                orders
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const countMyStoreOrdersDeliveredToday = async(req, res, next) => {
    try{
        const storeId = req.store._id
        const today = new Date().toISOString().replace('T', ' ').substring(0, 19)
        const orders = await Order.countDocuments({deliveryDate: {$gte: today},status: "Delivered", storeId: storeId})

        res.status(200).json({
            message:`Count of orders Fetched !`,
            data:{
                orders
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getOrdersListBetweenDateRange = async(req, res, next) => {
    try{
        let storeId = ""
        if(req.store){
            storeId = req.store._id
        }
        else{
            storeId = req.params.id
        }
        //console.log(storeId)
        const lesserThanDate = new Date(req.body.lesserThanDate).toISOString()
        const greaterThanDate = new Date(req.body.greaterThanDate).toISOString()
        //console.log(new Date(greaterThanDate))
        const orders = await Order.find({
            createdAt: {
                $gte: new Date(greaterThanDate),
                $lte: new Date(lesserThanDate)
            },
            storeId: storeId
        })
        res.status(200).json({
            message:`Orders list fetched !`,
            data:{
                orders
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const totalRevenueEarnedByMyStore = async(req, res, next) => {
    try{
        const storeId = req.store._id
        const orders = await Order.aggregate([
            { $match: { totalPrice: {$gte: 0}, storeId: storeId, status: "Delivered" } },
            { $group: { _id: null, totalRevenue: { $sum: "$totalPrice"} } }
        ])

        res.status(200).json({
            message:`Total Revenue Earned By Store !`,
            data:{
                orders
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const totalProfitEarnedByMyStore = async(req, res, next) => {
    try{
        const storeId = req.store._id
        const orders = await Order.aggregate([
            { $match: { totalPrice: {$gte: 0}, storeId: storeId, status: "Delivered" } },
            { $group: { _id: null}},
            { $addFields: { totalProfit: { $subtract: ["$totalPrice" , "$purchasePrice"]} } }
        ])

        res.status(200).json({
            message:`Total Revenue Earned By Store Orders!`,
            data:{
                orders
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}


//FOR ADMIN

const getAllOrdersOfStoreById = async(req, res, next) => {

    try{
        const storeId = req.params.id
        const orders = await Order.find({storeId: storeId})
        res.status(201).json({
            message:`Store Orders Fetched !`,
            data:{
                orders
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getActiveOrdersOfStoreById = async(req, res, next) => {

    try{
        const storeId = req.params.id
        const orders = await Order.find({storeId: storeId, status:'Active'})
        res.status(201).json({
            message:`Store Active Orders Fetched !`,
            data:{
                orders
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getPendingOrdersOfStoreById = async(req, res, next) => {

    try{
        const storeId = req.params.id
        const orders = await Order.find({storeId: storeId, status:'Pending'})
        res.status(201).json({
            message:`Store Pending Orders Fetched !`,
            data:{
                orders
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getCancelledOrdersOfStoreById = async(req, res, next) => {

    try{
        const storeId = req.params.id
        const orders = await Order.find({storeId: storeId, status:'Cancelled'})
        res.status(201).json({
            message:`Store Cancelled Orders Fetched !`,
            data:{
                orders
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getReturnedOrdersOfStoreById = async(req, res, next) => {

    try{
        const storeId = req.params.id
        const orders = await Order.find({storeId: storeId, status:'Returned'})
        res.status(201).json({
            message:`Store Returned Orders Fetched !`,
            data:{
                orders
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getCompletedOrdersOfStoreById = async(req, res, next) => {

    try{
        const storeId = req.params.id
        const orders = await Order.find({storeId: storeId, status:'Completed'})
        res.status(201).json({
            message:`Store Completed Orders Fetched !`,
            data:{
                orders
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllOrdersInAllStores = async(req, res, next) => {

    try{
        const orders = await Order.find({})
        res.status(200).json({
            message:`All Orders Fetched !`,
            data:{
                orders
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllCustomersOfStoreAndCountOfTheirOrders = async(req, res, next) => {
    try{
        let storeID = ""
        if(req.store){
            storeID = req.store._id
        }
        else{
            storeID = req.params.id
        }
        //console.log(storeID)
        const AllbuyerIdsAndCount = await Order.aggregate([
            {
              "$match": {
                "$expr": {
                      "$eq": [
                        "$storeId",
                        storeID
                      ]
                }
              }
            },
            {
              "$group": {
                "_id": {
                  "buyerId": "$buyerId",
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
          ])
          var BuyerIdsArray = []
          //seperate buyers Ids from objects
          AllbuyerIdsAndCount.forEach((item) =>{
            BuyerIdsArray.push(item._id.buyerId)
          })

        // now find all buyers with these id's
        let buyers = await Buyer.find({ '_id': { $in: BuyerIdsArray } });
        res.status(200).json({
            message:`Buyers Fetched !`,
            data:{
                buyers,
                orderCountOfBuyer: AllbuyerIdsAndCount
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllCustomersOfStoreAndCountOfTheirOrdersByStoreId = async(req, res, next) => {
    try{
        const storeID  = mongoose.Types.ObjectId(req.params.id)
        const AllbuyerIdsAndCount = await Order.aggregate([
            {
              "$match": {
                "$expr": {
                      "$eq": [
                        "$storeId",
                        storeID
                      ]
                }
              }
            },
            {
              "$group": {
                "_id": {
                  "buyerId": "$buyerId",
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
          ])

          var BuyerIdsArray = []
          //seperate buyers Ids from objects
          AllbuyerIdsAndCount.forEach((item) =>{
            BuyerIdsArray.push(item._id.buyerId)
          })

        // now find all buyers with these id's
        let buyers = await Buyer.find({ '_id': { $in: BuyerIdsArray } });

        res.status(200).json({
            message:`Buyers Fetched !`,
            data:{
                buyers,
                orderCountOfBuyer: AllbuyerIdsAndCount
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}



module.exports = {
    //for buyer
    addOrder,
    viewOrdersPlacedByMe,
    getOrdersPlacedByMeByOrderStatus,
    getMyOrderDetailsById,
    //for seller and admin
    updateOrderById,
    deleteOrderById,
    getOrderDetailsById,
    getAllOrdersOfMyStore,
    getOrdersOfMyStoreByStatus,
    countTotalSalesOfStore,
    countMyStoreOrderssByStatus,
    countMyStoreOrdersDeliveredToday,
    totalRevenueEarnedByMyStore,
    totalProfitEarnedByMyStore,
    updateOrderedProductById,
    deleteOrderedProductById,
    getOrdersListBetweenDateRange,
    getAllCustomersOfStoreAndCountOfTheirOrders,
    getAllCustomersOfStoreAndCountOfTheirOrdersByStoreId,
    //for admin
    getAllOrdersOfStoreById,
    getPendingOrdersOfStoreById,
    getCancelledOrdersOfStoreById,
    getCompletedOrdersOfStoreById,
    getReturnedOrdersOfStoreById,
    getActiveOrdersOfStoreById,
    getAllOrdersInAllStores
}