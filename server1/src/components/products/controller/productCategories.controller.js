const ProductCategory = require('../model/productCategories.model')

const addCategory= async(req, res, next) => {
    try{
        const isCategoryPresent = await ProductCategory.findOne({
            vendorName: req.body.vendorName,
            vendorCategory: req.body.vendorCategory,
            mainCategoryName: req.body.mainCategoryName,
        })
        if(isCategoryPresent){
            throw new Error('Sorry ! This vendor product category is already present.')
        }
        else{
            const productCategory = new ProductCategory(req.body)
            await productCategory.save()
            res.status(200).json({
            message:`Product category has been added successfully!`,
            data:{
                productCategory
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

const getAllMainCategories = async(req, res, next) => {
    try{
        const categories = await ProductCategory.find({}).select({'mainCategoryName':1, '_id': 0})
        let mainCategories = []
        categories.forEach((category) => mainCategories.push(category.mainCategoryName))
        res.status(200).json({
            message:`All Main Categories fetched successfully!`,
            data:{
                mainCategories
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllMainCategoriesByVendorNameAndCategory = async(req, res, next) => {
    try{
        const vendorName = req.params.vendor
        const vendorCategory = req.params.category
        const categories = await ProductCategory.find({vendorName, vendorCategory}).select({'mainCategoryName':1, '_id': 0})
        let mainCategories = []
        categories.forEach((category) => mainCategories.push(category.mainCategoryName))
        res.status(200).json({
            message:`All Main Categories of vendor fetched successfully!`,
            data:{
                mainCategories
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllSubCategoriesOfVendorMainCategory = async(req, res, next) => {
    try{
        const filters = req.body
        if(filters.vendorName == "other" || filters.vendorName == "Other"){
            delete filters.vendorName
        }
        if(filters.vendorCategory == "other" || filters.vendorCategory == "Other"){
            delete filters.vendorCategory
        }
        const categories = await ProductCategory.find(filters)
        let subCategories = []
        categories.forEach((category) => {
            category.subCategories.forEach((subCategry) => {
                subCategories.push(subCategry)
            })
        })
        if(categories.length == 0){
            throw new Error('No child categories found of this category!')
        }
        res.status(200).json({
            message:`Sub-Categories fetched successfully!`,
            data:{
                subCategories
            }
        })
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllSubCategoriesOfMainCategory = async(req, res, next) => {
    try{
        const mainCategory = req.params.mainCategory
        const categories = await ProductCategory.find({mainCategoryName: mainCategory})
        let subCategories = []
        categories.forEach((category) => {
            category.subCategories.forEach((subCategry) => {
                subCategories.push(subCategry)
            })
        })
        if(categories.length == 0){
            throw new Error('No child categories found of this category!')
        }
        res.status(200).json({
            message:`Sub-Categories fetched successfully!`,
            data:{
                subCategories
            }
        })
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

//FOR ALL SUB CATEGORIES

const addSubCategory = async(req, res, next) => {
    try{
        let isCategoryPresent = ""
        //check if product sub category is already present in vendor's product subCategories
        isCategoryPresent = await ProductCategory.findOne(
            {
            mainCategoryName: req.body.mainCategoryName,
            vendorCategory: req.body.vendorCategory,
            vendorName: req.body.vendorName,
            subCategories:{$elemMatch :{name: req.body.subCategoryName}}
            }
        )
        if(isCategoryPresent){
            throw new Error(`Sorry! This product sub-category is already present.`)
        }
        else{
            const category = await ProductCategory.findOne(
                {
                mainCategoryName: req.body.mainCategoryName,
                vendorCategory: req.body.vendorCategory,
                vendorName: req.body.vendorName,
                }
            )
            if(!category){
                throw new Error('No category found containing these details!')
            }
            category.subCategories.push({
                name: req.body.subCategoryName,
                description: req.body.subCategoryDescription
            })
            await category.save()
            res.status(200).json({
                message:`Your product sub-category has been added successfully!`,
                data:{
                    category
                }
            })
        }
        
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const updateSubCategoryById = async(req, res, next) => {
    try{
        const updates = Object.keys(req.body)
        const _id = req.params.id
        const category = await ProductCategory.findOne({
            subCategories:{$elemMatch :{_id: _id}}
        })
        if(!category){
            throw new Error('No category found!')
        }
        category.subCategories.forEach((category) => {
            if(category._id == _id){
                updates.forEach((update) => category[update] = req.body[update])
            }
        })
        await category.save()
        res.status(200).json({
            message:`Category has been updated successfully!`,
            data:{
                category
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}


const deleteSubCategoryById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const category = await ProductCategory.findOne({
            subCategories:{$elemMatch :{_id: _id}}
        })
        if(!category){
            throw new Error('Category not found !')
        }
        //filter category
        category['subCategories'] = category['subCategories'].filter(function(subCategory){
            return subCategory._id != _id; 
        });
        await category.save()
        res.status(200).json({
            message:`Product sub category has been deleted successfully!`,
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

const getSubCategoryById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const category = await ProductCategory.findOne({
            subCategories:{$elemMatch :{_id: _id}}
        })
        if(!category){
            throw new Error('Category not found !')
        }
        let subCategory = ""
        category.subCategories.forEach((category) => {
            if(category._id == _id){
                subCategory = category
            }
        })
        res.status(200).json({
            message:`Category fetched successfully!`,
            data:{
                subCategory
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllSubCategories = async(req, res, next) => {
    try{
        const categories = await ProductCategory.find({})
        let subCategories = []
        categories.forEach((category) => {
            category.subCategories.forEach((subCategry) => {
                subCategories.push(subCategry)
            })
        })

        res.status(200).json({
            message:`Sub Categories fetched successfully!`,
            data:{
                subCategories
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}


//for brands

const addBrandOfCategory = async(req, res, next) => {
    try{
        let isBrandPresent = ""
        const parentCategoryName = req.params.category
        isBrandPresent = await ProductCategory.findOne({
            brands:{$elemMatch :{name: req.body.name}}
        })
        if(isBrandPresent){
            res.status(200).json({
                message:`Sorry ! This brand is already present.`,
                data:{
                }
            })
        }
        
        else{
            const brand = await ProductCategory.findOneAndUpdate(
                {name: parentCategoryName}, 
                { $push: { brands: req.body} 
                })
            const category = await ProductCategory.findOne({name: parentCategoryName})
            if(!category){
                throw new Error('No category found!')
            }
            res.status(200).json({
                message:`Brand been added successfully!`,
                data:{
                    category
                }
            })
        }
        
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const updateBrandById = async(req, res, next) => {
    try{
        const updates = Object.keys(req.body)
        const _id = req.params.id
        const category = await ProductCategory.findOne({
            brands:{$elemMatch :{_id: _id}}
        })
        if(!category){
            throw new Error('No brand found!')
        }
        category.brands.forEach((brand) => {
            if(brand._id == _id){
                updates.forEach((update) => brand[update] = req.body[update])
            }
        })
        await category.save()
        res.status(200).json({
            message:`Brand has been updated successfully!`,
            data:{
                category
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const deleteBrandById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const category = await ProductCategory.findOne({
            brands:{$elemMatch :{_id: _id}}
        })
        if(!category){
            throw new Error('Brand not found !')
        }
        //filter category
        category['brands'] = category['brands'].filter(function(brand){
            return brand._id != _id; 
        });
        await category.save()
        res.status(200).json({
            message:`Brand has been deleted successfully!`,
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

const getBrandById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const category = await ProductCategory.findOne({
            brands:{$elemMatch :{_id: _id}}
        })
        if(!category){
            throw new Error('Brand not found !')
        }
        let getBrand = ""
        category.brands.forEach((brand) => {
            if(brand._id == _id){
                getBrand = brand
            }
        })
        res.status(200).json({
            message:`Brand fetched successfully!`,
            data:{
                brand: getBrand
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}




module.exports = {
    //MAIN CATEGORY
    addCategory,
    deleteCategory,
    updateCategory,
    getCategoryById,
    getAllCategories,
    getAllSubCategoriesOfVendorMainCategory,
    getAllMainCategories,
    getAllMainCategoriesByVendorNameAndCategory,
    getAllSubCategoriesOfMainCategory,
    //FOR SUB CATEGORY
    addSubCategory,
    deleteSubCategoryById,
    updateSubCategoryById,
    getSubCategoryById,
    getAllSubCategories,
    //FOR BRANDS
    addBrandOfCategory,
    deleteBrandById,
    updateBrandById,
    getBrandById
}