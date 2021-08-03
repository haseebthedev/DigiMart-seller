const Store = require('../model/store.model')
const Product = require('../../products/model/product.model')
const Vendor = require('../../users/vendor/models/vendor.model')

const registerStore = async(req, res, next) => {
    try{
        const user = req.user
        const store = new Store(req.body)
        await store.save()
        user.storeId = store._id
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

//ROUTES FOR ADMIN

const getTotalNumberOfStoreApprovals = async(req, res, next) =>{
    try{
        const filters = {isApproved: false}
        const totalNumberOfStores = await Store.count(filters)
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

const getTotalNumberOfStoresApproved = async(req, res, next) =>{
    try{
        const filters = {isApproved: true}
        const totalNumberOfStores = await Store.count(filters)
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

const approveStore = async(req, res, next) => {
    try{
        const storeID = req.params.id
        const store = await Store.findOne({_id: storeID})
        store.isApproved = true
        await store.save()
        return res.status(200).json({
            message:`Approved!`,
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

const disApproveStore = async(req, res, next) => {
    try{
        const storeID = req.params.id
        const store = await Store.findOne({_id: storeID})
        store.isApproved = false
        await store.save()
        return res.status(200).json({
            message:`Not Approved!`,
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
        // const allowedUpdated=['name','category','city','counrty','type','warehouseAddress',
        // 'buissnessAddress','isApprovedPromotionTool','logo','activityStatus','biography','isApproved',
        // 'transactionLimit']
        // const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
        // if(!isValidOperation){
        //     throw new Error('Invalid Keys! Please enter valid keys.')
        // }
        const store = await Store.findById(_id)
        if(!store){
            throw new Error('No store found!')
        }
        updates.forEach((update) => store[update] = req.body[update])
        await store.save()
        return res.status(200).json({
            message:`Store and Vendor updated successfully.`,
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



 
module.exports = {
    //for store owner
    registerStore,
    getStoreDetails,
    updateStore,
    //for admin
    getTotalNumberOfStoreApprovals,
    getTotalNumberOfStoresApproved,
    approveStore,
    disApproveStore,
    enableMarketingService,
    disableMarketingService,
    viewAllStores,
    editStoreById,
    viewStoreById
}