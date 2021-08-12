const Review = require('../model/review.model')

//FOR AUTHENTICATED BUYER
const addReview = async(req, res, next) => {
    try{
        req.body.buyerId = req.user._id
        req.body.buyerName = req.user.name
        req.body.buyerEmail = req.user.email
        const review = new Review(req.body)
        await review.save()
        res.status(201).json({
            message:`Review has been added successfully to product!`,
            data:{
                review
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const updateReviewById = async(req, res, next) => {
    try{
        const updates = Object.keys(req.body)
        const _id = req.params.id
        const review = await Review.findById(_id)
        updates.forEach((update) => {
            review[update] = req.body[update]
        })
        await review.save()
        res.status(201).json({
            message:`Review has been updated!`,
            data:{
                review
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const deleteReviewById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const review = await Review.findByIdAndDelete(_id)
        res.status(201).json({
            message:`Review has been deleted!`,
            data:{
                review
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getReviewById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const review = await Review.findById(_id)
        res.status(201).json({
            message:`Review has been fetched!`,
            data:{
                review
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllReviewsGivenByMe = async(req, res, next) => {
    try{
        const buyer = req.user
        const reviews = await Review.find({buyerId: buyer._id})
        res.status(201).json({
            message:`Review given by you fetched!`,
            data:{
                reviews
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

//FOR AUTHENTICATED VENDOR

const getAllReviewsOfMyStore = async(req, res, next) => {
    try{
        if(!req.store){
            throw new Error('Please register your store first!')
        }
        const store = req.store
        const reviews = await Review.find({storeId: store._id})
        res.status(201).json({
            message:`Reviews of my store fetched!`,
            data:{
                reviews
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const addResponseOfReviewById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const review = await Review.findById(_id)
        review.response = req.body.response
        await review.save()
        res.status(201).json({
            message:`Response added !`,
            data:{
                review
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllReviewsOfBuyerById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const reviews = await Review.find({buyerId: _id})
        res.status(201).json({
            message:`Reviews of buyer has been fetched!`,
            data:{
                reviews
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllReviewsOfProductById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const reviews = await Review.find({productId: _id})
        res.status(201).json({
            message:`Reviews of product has been fetched!`,
            data:{
                reviews
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

//FOR AUTHENTICATED ADMINS

const getAllReviewsOfStoreById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const reviews = await Review.find({storeId: _id})
        res.status(201).json({
            message:`Reviews of store fetched!`,
            data:{
                reviews
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllReviewsOfAllStores = async(req, res, next) => {
    try{
        const _id = req.params.id
        const reviews = await Review.find({})
        res.status(201).json({
            message:`Reviews of all stores fetched!`,
            data:{
                reviews
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
    addReview,
    getAllReviewsGivenByMe,
    //for buyer and admin
    updateReviewById,
    deleteReviewById,
    getReviewById,
    //for admin
    getAllReviewsOfStoreById,
    getAllReviewsOfAllStores,
    //for vendor and admin
    getAllReviewsOfProductById,
    getAllReviewsOfBuyerById,
    //for vendor only
    getAllReviewsOfMyStore,
    addResponseOfReviewById
}