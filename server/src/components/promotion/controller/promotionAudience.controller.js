const PromotionAudience = require('../model/promotionAudience.model')

const addPromotionAudience = async(req, res, next) => {
    try{
        const audience = new PromotionAudience(req.body)
        await audience.save()
        res.status(201).json({
            message:`Promotion audience has been added successfully!`,
            data:{
                audience
            }
        })
    }
    catch (err){
        err.status = 204
        next(err)
    }
}

//update the audience of specific category
const updatePromotionAudienceByCategory = async(req, res, next) => {
    try{
        const category = req.params.category
        //adding data in promotionData Array
        const addPromotionsData = await PromotionAudience.findOneAndUpdate(
            {audienceInterestCategory: category}, 
            { $push: { promotionData: req.body} 
            })
        if(!addPromotionsData){
            throw new Error('No audience found of this category!')
        }
        res.status(200).json({
            message:`Promotion audience updated successfully!!`,
            data:{
                addPromotionsData
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

//delete promotion audience of specific category
const deletePromotionAudienceByCategory = async(req, res, next) => {
    try{
        const audienceInterestCategory = req.params.category
        const promotionAudience = await PromotionAudience.findOneAndDelete({audienceInterestCategory})
        if(!promotionAudience){
            throw new Error('No Promotion audience found of this category !')
        }
        res.status(200).json({
            message:`Promotion audience has been deleted successfully!`,
            data:{
                promotionAudience
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getPromotionAudienceOfProductCategory = async(req, res, next) => {
    try{
        const category = req.params.category
        const promotionAudience = await PromotionAudience.find({productCategory: { $in: [category] }});
        if(promotionAudience.length == 0){
            throw new Error('No audience found of this category!')
        }
        res.status(200).json({
            message:`Promotion audience fetched successfully!`,
            data:{
                promotionAudience
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

module.exports = {
    addPromotionAudience,
    updatePromotionAudienceByCategory,
    deletePromotionAudienceByCategory,
    getPromotionAudienceOfProductCategory
}