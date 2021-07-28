const ProductCategory = require('../model/productCategories.model')

const addCategory= async(req, res, next) => {
    try{
        const productCategory = new ProductCategory(req.body)
        await productCategory.save()
        res.status(200).json({
            message:`Your product category has been added successfully!`,
            data:{
                productCategory
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const deleteCategory = async(req, res, next) => {
    try{
        const _id = req.params.id
        const category = await ProductCategory.findOneAndDelete({_id:_id})
        if(!category){
            throw new Error('Product Category not found!')
        }
        res.status(200).json({
            message:`Product category has been deleted successfully!`,
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
        
        const category = await ProductCategory.findOne({_id:categoryID})
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
        const category = await ProductCategory.find({_id:_id})
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
        const categories = await ProductCategory.find({})
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

const getAllChildCategoriesOfParent = async(req, res, next) => {
    try{
        const category = req.params.category
        const categories = await ProductCategory.find({parentCategoryName: category})
        if(categories.length == 0){
            throw new Error('No child categories found of this category!')
        }
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
    getAllCategories,
    getAllChildCategoriesOfParent
}