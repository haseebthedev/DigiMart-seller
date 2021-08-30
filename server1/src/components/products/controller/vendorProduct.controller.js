const VendorProduct = require('../model/vendorProduct.model')
const Vendor = require('../../vendor/model/vendor.model')

const addVendorProductById = async(req, res, next) => {
    try{
        const vendorId = req.params.id
        const vendor = await Vendor.findOne({_id: vendorId})
        if(!vendor){
            throw new Error('No vendor found with this Id !')
        }
        if(vendor.status)
        console.log(vendor)
        if(vendor.isAuthenticBrand){
            req.body.isAuthenticVendorProduct = true
        }
        //set vendor Id from params into body
        req.body.vendorId = vendorId
        req.body.vendorCompanyName = vendor.companyName
        req.body.vendorCategory = vendor.category
        req.body.vendorTypeOfBusiness = vendor.typeOfBusiness
        const vendorProduct = new VendorProduct(req.body)
        await vendorProduct.save()
        res.status(201).json({
            message:`${vendor.companyName} product has been added successfully!`,
            data:{
                product: vendorProduct
            }
        })

    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const updateVendorProductById = async(req, res, next) => {
    try{
        const updates = Object.keys(req.body)
        //validations
        // const allowedUpdated = ['name','category','description','manufactureDate','stockAvailable','price',
        // 'weight','discountPercentage','manufacturer','warranty','images','colors','isVisibilityEnabled']
        // const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
        // if(!isValidOperation || updates.length == 0){
        //     throw new Error('Invalid Keys! Please enter valid keys.')
        // }
        const productID = req.params.id
        const product = await VendorProduct.findOne({_id:productID})
        
        updates.forEach((update) => {
            product[update] = req.body[update]
        })
        await product.save()
        res.status(200).json({
            message:`Vendor's product has been updated successfully!`,
            data:{
                product: product
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const deleteVendorProductById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const product = await VendorProduct.findOneAndDelete({_id:_id})
        if(!product){
            throw new Error('Product not found!')
        }
        res.status(200).json({
            message:`Vendor's product has been deleted successfully!`,
            data:{
                product: product
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const deleteAllVendorProductsById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const products = await VendorProduct.deleteMany({vendorId: _id})
        if(!products){
            throw new Error('Product not found!')
        }
        res.status(200).json({
            message:`Vendor's all products deleted successfully!`,
            data:{
                deletedProductsCount: products.deletedCount
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const viewVendorAllProductsById = async(req, res, next) => {
    try{
        const vendorID = req.params.id
        const products = await VendorProduct.find({vendorId: vendorID})
        if(!products){
            throw new Error('Products not found!')
        }
        res.status(200).json({
            message:`Vendor products fetched successfully!`,
            data:{
                products: products
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const viewActiveVendorAllProducts = async(req, res, next) => {
    try{
        const vendorID = req.params.id
        const products = await VendorProduct.find({vendorId: vendorID, isVisibilityEnabled: true})
        if(!products){
            throw new Error('Products not found!')
        }
        res.status(200).json({
            message:`Vendor products fetched successfully!`,
            data:{
                products: products
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const viewVendorProductById = async(req, res, next) => {
    try{
        const productID = req.params.id
        const product = await VendorProduct.findOne({_id: productID})
        if(!product){
            throw new Error('Product not found!')
        }
        res.status(200).json({
            message:`Vendor product fetched successfully!`,
            data:{
                product: product
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const viewAllProductsByProductCategory = async(req, res, next) => {
    try{
        const category = req.params.category
        const products = await VendorProduct.find({category: category})
        if(!products){
            throw new Error('Products not found!')
        }
        res.status(200).json({
            message:`${category} products fetched successfully!`,
            data:{
                products: products
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const viewAllProductsOfAllVendors = async(req, res, next) => {
    try{
        const products = await VendorProduct.find({})
        if(!products){
            throw new Error('Products not found!')
        }
        res.status(200).json({
            message:`All products fetched successfully!`,
            data:{
                products: products
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

module.exports = {
    //for admin
    addVendorProductById,
    updateVendorProductById,
    deleteVendorProductById,
    //for vendor and admin
    viewVendorAllProductsById,
    viewActiveVendorAllProducts,
    viewVendorProductById,
    viewAllProductsByProductCategory,
    viewAllProductsOfAllVendors,
    deleteAllVendorProductsById,
    
}