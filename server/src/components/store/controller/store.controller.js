const Store = require('../model/store.model')

const registerStore = async(req, res, next) => {
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
        const storeID = req.store._id
        const myStore = await Store.find({_id:storeID})
        res.status(201).json({
            message: `Store data fetched Successfully!`,
            store: myStore
        })
    }
    catch(err){
        err.status = 404
        next(err)
    }
}
module.exports = {
    registerStore,
    getStoreDetails
}