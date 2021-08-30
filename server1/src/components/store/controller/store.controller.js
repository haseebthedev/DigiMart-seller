const Store = require('../model/store.model')
const Seller = require('../../users/seller/models/seller.model')
const Buyer = require('../../users/buyer/models/buyer.model')
const Product = require('../../products/model/product.model')

const registerStore = async(req, res, next) => {
    try{
        const user = req.user
        //add seler name and _id in store
        req.body.sellerId = user._id
        req.body.sellerName = user.name
        const store = new Store(req.body)
        await store.save()
        user.storeId = store._id
        //set store registered in seller profile
        user.isStoreRegistered = true
        await user.save()
        res.status(201).json({
            message:`Your request for registration has been sent successfully. You will be informed soon.`,
            data:{
                store: store
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getStoreDetails = async(req, res, next) => {
    try{
        const store = req.store
        res.status(201).json({
            message: `Store data fetched Successfully!`,
            data: {
                store:store
            }
        })
    }
    catch(err){
        err.status = 404
        next(err)
    }
}

const updateStore = async(req, res, next) => {
    try{
        const updates=Object.keys(req.body)
        // const allowedUpdated=['name','category','city','counrty','type','warehouseAddress',
        // 'buissnessAddress','isApprovedPromotionTool','logo','activityStatus','biography','isApproved',
        // 'transactionLimit']
        // const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
        // if(!isValidOperation){
        //     throw new Error('Invalid Keys! Please enter valid keys.')
        // }
        const store = req.store
        if(store.status == "Deactivate"){
                const products = await Product.find({storeID: store._id})
                products.forEach(async (product) => {
                    product.isVisibilityEnabled = false
                    await product.save()
                })
                //logout from all devices
                user.tokens = []
        }
        updates.forEach((update) => store[update] = req.body[update])
        await store.save()
        return res.status(200).json({
            message:`Store has been updated successfully.`,
            data:{
                store: req.store
            }
        })
    }
    catch(err){
        err.status = 404
        next(err)
    }
}

const getStoreCategory = async(req, res, next) => {
    try{
        const store = req.store
        res.status(200).json({
            message: `Store category fetched Successfully!`,
            data: {
                category : store.category
            }
        })
    }
    catch(err){
        err.status = 404
        next(err)
    }
}

const viewSubscribersOfStore = async(req, res, next) => {
    try{
        const storeId = req.store._id
        const subscribers = await Buyer.find({subscribedStores: {"$in" : storeId}})
        res.status(200).json({
            message: `Store subscribers fetched Successfully!`,
            data: {
                subscribers
            }
        })
    }
    catch(err){
        err.status = 404
        next(err)
    }
}
//ROUTES FOR ADMIN

const viewSubscribersOfStoreByStoreId = async(req, res, next) => {
    try{
        const storeId = req.params.id
        const subscribers = await Buyer.find({subscribedStores: {"$in" : storeId}})
        res.status(200).json({
            message: `Store subscribers fetched Successfully!`,
            data: {
                subscribers
            }
        })
    }
    catch(err){
        err.status = 404
        next(err)
    }
}

const getTotalNumberOfStoreApprovals = async(req, res, next) =>{
    try{
        const filters = {status: "Pending"}
        const totalNumberOfStores = await Store.countDocuments(filters)
        return res.status(200).json({
            message:`Total number of Stores for approval fetched successfully!.`,
            data:{
                totalNumber: totalNumberOfStores
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const viewAllStoreApprovalsPending = async(req, res, next) =>{
    try{
        const filters = {status: "Pending"}
        const totalNumberOfStores = await Store.find(filters)
        return res.status(200).json({
            message:` Stores Pending for approval fetched successfully!.`,
            data:{
                stores: totalNumberOfStores
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const viewAllStoresApprovedActive = async(req, res, next) =>{
    try{
        const filters = {status: "Active"}
        const totalNumberOfStores = await Store.find(filters)
        return res.status(200).json({
            message:` Stores approved/active fetched successfully!.`,
            data:{
                stores: totalNumberOfStores
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const getTotalNumberOfStoresApproved = async(req, res, next) =>{
    try{
        const filters = {status: "Active"}
        const totalNumberOfStores = await Store.countDocuments(filters)
        return res.status(200).json({
            message:`Total number of Stores approved fetched successfully!.`,
            data:{
                totalNumber: totalNumberOfStores
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const enableMarketingService = async(req, res, next) => {
    try{
        const storeID = req.params.id
        const store = await Store.findOne({_id: storeID})
        store.isApprovedPromotionTool = true
        await store.save()
        return res.status(200).json({
            message:`Enabled Marketing Tool!`,
            data:{
                store: store
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const disableMarketingService = async(req, res, next) => {
    try{
        const storeID = req.params.id
        const store = await Store.findOne({_id: storeID})
        store.isApprovedPromotionTool = false
        await store.save()
        return res.status(200).json({
            message:`Disabled Marketing Tool!`,
            data:{
                store: store
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const viewAllStores = async(req, res, next) => {
    try{
        const stores = await Store.find({})
        return res.status(200).json({
            message:`Stores fetched !`,
            data:{
                stores
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const editStoreById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const updates=Object.keys(req.body)
        const store = await Store.findById(_id)
        if(!store){
            throw new Error('No store found!')
        }
        //check if store is blocked or deactivated then set all its items visibility to false
        if(req.body.status == "Blocked" || req.body.status == "Deactivate"){
            const products = await Product.find({storeID: store._id})
            products.forEach(async (product) => {
                product.isVisibilityEnabled = false
                await product.save()
            })
        }
        if(req.body.status == "Active"){
            const products = await Product.find({storeID: store._id})
            products.forEach(async (product) => {
                product.isVisibilityEnabled = true
                await product.save()
            })
        }
        updates.forEach((update) => store[update] = req.body[update])
        await store.save()
        return res.status(200).json({
            message:`Store updated successfully.`,
            data:{
                store
            }
        })
    }
    catch(err){
        err.status = 404
        next(err)
    }
}

const viewStoreById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const store = await Store.findById(_id)
        return res.status(200).json({
            message:`Store fetched successfully.`,
            data:{
                store
            }
        })
    }
    catch(err){
        err.status = 404
        next(err)
    }
}

const addStoreOfSellerById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const user = await Seller.findById(_id)
        req.body.status = "Active"
        //add seller ID and name in store
        req.body.sellerId = user._id
        req.body.sellerName = user.name

        const store = new Store(req.body)
        await store.save()
        user.storeId = store._id
        await user.save()
        res.status(201).json({
            message:`Added store successfully and set it active.`,
            data:{
                store: store
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}



 
module.exports = {
    //for store owner
    registerStore,
    getStoreDetails,
    updateStore,
    getStoreCategory,
    viewSubscribersOfStore,
    //for admin
    viewSubscribersOfStoreByStoreId,
    getTotalNumberOfStoreApprovals,
    getTotalNumberOfStoresApproved,
    enableMarketingService,
    disableMarketingService,
    viewAllStores,
    editStoreById,
    viewStoreById,
    addStoreOfSellerById,
    viewAllStoreApprovalsPending,
    viewAllStoresApprovedActive
}