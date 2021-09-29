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
        err.status = 424
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
        const promotionAudience = await PromotionAudience.find({productCategory: { $in: [category] }});
        res.status(200).json({
            message:`Promotion audience updated successfully!!`,
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

const updateAudienceInterestCategoryById = async(req, res, next) => {
    try{
        const id = req.params.id
        const promotionAudience = await PromotionAudience.findOne({_id: id});
        if(!promotionAudience){
            throw new Error('No audience found !')
        }
        promotionAudience.audienceInterestCategory = req.body.audienceInterestCategory
        await promotionAudience.save()
        res.status(200).json({
            message:`Updated successfully!`,
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

const getPromotionAudienceOfAllCategories = async(req, res, next) => {
    try{
        const promotionAudience = await PromotionAudience.find({});
        if(promotionAudience.length == 0){
            throw new Error('No audience found !')
        }
        res.status(200).json({
            message:`Fetched audience successfully!`,
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

const addProductCategoriesInPromotionAudienceById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const categories = req.body.productCategory
        //adding data in promotionData Array
        const addProductCategory = await PromotionAudience.findOneAndUpdate(
            {_id: _id}, 
            { $push: { productCategory: categories} 
            })
        if(!addProductCategory){
            throw new Error('No audience found of this category!')
        }
        const promotionAudience = await PromotionAudience.findById(_id);
        res.status(200).json({
            message:`Product categories updated successfully!!`,
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

const deleteProductCategoriesInPromotionAudienceById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const productCategories = req.body.productCategory
        if(!productCategories){
            throw new Error('Please enter product categories !')
        }
        const promotionAudience = await PromotionAudience.findOne({_id: _id})
        if(!promotionAudience){
            throw new Error('No audience found of this category!')
        }
        productCategories.forEach(function(productCategory) {
            promotionAudience.productCategory = promotionAudience.productCategory.filter((category) => {
                return category != productCategory
            })
        })
        await promotionAudience.save() 
        res.status(200).json({
            message:`Product categories deleted successfully!!`,
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
    //ADMIN
    addPromotionAudience,
    updatePromotionAudienceByCategory,
    deletePromotionAudienceByCategory,
    getPromotionAudienceOfProductCategory,
    updateAudienceInterestCategoryById,
    getPromotionAudienceOfAllCategories,
    addProductCategoriesInPromotionAudienceById,
    deleteProductCategoriesInPromotionAudienceById

    //SELLER
    //getPromotionAudienceOfProductCategory,
}