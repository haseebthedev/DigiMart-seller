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

module.exports = {
    registerStore,
    getStoreDetails,
    updateStore,
    getTotalNumberOfStoreApprovals,
    getTotalNumberOfStoresApproved,
}