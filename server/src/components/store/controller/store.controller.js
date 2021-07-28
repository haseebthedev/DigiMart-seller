const Store = require('../model/store.model')
const Product = require('../../products/model/product.model')

const registerStore = async(req, res, next) => {
    req.body['name'] = req.user.storeName
    const store = new Store(req.body)
    try{
        await store.save()
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
        const allowedUpdated=['name','category','city','counrty','type','warehouseAddress',
        'buissnessAddress','isApprovedPromotionTool','logo','activityStatus','biography','isApproved',
        'transactionLimit']
        const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
        const isStoreNameChanged = updates.includes('name')
        if(!isValidOperation){
            throw new Error('Invalid Keys! Please enter valid keys.')
        }
        const user = req.user
        const store = req.store
        updates.forEach((update) => store[update] = req.body[update])
        await store.save()
        if(isStoreNameChanged){
            user.storeName = store.name
            await user.save()
        }
        if(!user){
            throw new Error('User not found!')
        }
        return res.status(200).json({
            message:`Store has been updated successfully.`,
            data:{
                user: req.user,
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
    disableMarketingService
}