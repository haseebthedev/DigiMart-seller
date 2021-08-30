const VendorCategory = require('../model/vendorCategory.model')

const addCategory= async(req, res, next) => {
    try{
        const isCategoryPresent = await VendorCategory.findOne({name: req.body.name})
        if(isCategoryPresent){
            res.status(200).json({
                message:`Sorry ! This vendor category is already present.`,
                data:{
                }
            })
        }
        else{
            const vendorCategory = new VendorCategory(req.body)
            await vendorCategory.save()
            res.status(200).json({
                message:`Your vendor category has been added successfully!`,
                data:{
                    vendorCategory
                }
            })
        }
        
    }
    catch(e){
        e.status = 404
        next(e)
    }
}


const deleteCategory = async(req, res, next) => {
    try{
        const _id = req.params.id
        const category = await VendorCategory.findOneAndDelete({_id:_id})
        if(!category){
            throw new Error('Vendor Category not found!')
        }
        res.status(200).json({
            message:`Vendor category has been deleted successfully!`,
            data:{
                category
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const updateCategory = async(req, res, next) => {
    try{
        const updates = Object.keys(req.body)
        const categoryID = req.params.id
        
        const category = await VendorCategory.findOne({_id:categoryID})
        updates.forEach((update) => category[update] = req.body[update])
        await category.save()
        res.status(200).json({
            message:`Category has been updated successfully!`,
            data:{
                category
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getCategoryById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const category = await VendorCategory.find({_id:_id})
        if(category.length == 0){
            throw new Error('Category not found!')
        }
        res.status(200).json({
            message:`Category fetched successfully!`,
            data:{
                category
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllCategories = async(req, res, next) => {
    try{
        const categories = await VendorCategory.find({})
        res.status(200).json({
            message:`Categories fetched successfully!`,
            data:{
                categories
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

module.exports = {
    addCategory,
    deleteCategory,
    updateCategory,
    getCategoryById,
    getAllCategories
}