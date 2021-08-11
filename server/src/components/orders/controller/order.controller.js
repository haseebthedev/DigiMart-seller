const Order = require('../model/order.model')
const Product = require('../../products/model/product.model')

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

//for vendor
const updateOrderById = async(req, res, next) => {

    try{
        if(req.body.products){
            throw new Error('Inavlid keys entered. Cannot update product details !')
        }
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
        res.status(201).json({
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

const deleteOrderById = async(req, res, next) => {

    try{
        const _id = req.params.id
        const order = await Order.findOneAndDelete(_id)
        res.status(201).json({
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
        res.status(201).json({
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
        res.status(201).json({
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
        const storeId = req.store._id
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

const countTotalSalesOfStore= async(req, res, next) => {
    try{
        const storeId = req.store._id
        const sales = await Order.count({storeId: storeId, status:"Delivered"})

        res.status(201).json({
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
        res.status(201).json({
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

module.exports = {
    //for buyer
    addOrder,
    //for seller and admin
    updateOrderById,
    deleteOrderById,
    getOrderDetailsById,
    getAllOrdersOfMyStore,
    getOrdersOfMyStoreByStatus,
    countTotalSalesOfStore,
    //for admin
    getAllOrdersOfStoreById,
    getPendingOrdersOfStoreById,
    getCancelledOrdersOfStoreById,
    getCompletedOrdersOfStoreById,
    getReturnedOrdersOfStoreById,
    getActiveOrdersOfStoreById,
    getAllOrdersInAllStores
}