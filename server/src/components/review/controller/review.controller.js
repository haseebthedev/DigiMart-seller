const Review = require('../model/review.model')

const addReview = async(req, res, next) => {
    try{
        if(!req.user){
            throw new Error('Please login first to add review of product !')
        }
        req.body.buyerId = req.user._id
        const review = new Review(req.body)
        await review.save()
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

module.exports = {
    addReview
}