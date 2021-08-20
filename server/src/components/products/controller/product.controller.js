const Store = require('../../store/model/store.model')
const Product = require('../model/product.model')

const addProductToMyStore = async(req, res, next) => {

    //FOR AUTHENTICATED VENDOR
    try{
        //check if product name added before in this store DB
        if(!req.store){
            throw new Error('Please register your store to add Product.')
        }
        const isProductNamePresent = await Product.findOne({name:req.body.name,storeID:req.store._id})
        if(isProductNamePresent){
            throw new Error('Product with this name already added before.')
        }
        req.body['storeID'] = req.store._id
        const product = new Product(req.body)
        await product.save()
        res.status(201).json({
            message:`Your product has been added successfully!`,
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

const updateProduct = async(req, res, next) => {
    try{
        const updates = Object.keys(req.body)

        //check if product is the one selected from vendor's products
        if(req.body.vendorId){
            //validations
            const allowedUpdated = ['stockAvailable','salePrice']
            const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
            if(!isValidOperation || updates.length == 0){
                throw new Error('Invalid Keys! You can only update stock and sale price.')
            }
        }
        const productID = req.params.id
        const storeID = req.store._id
        const product = await Product.findOne({_id:productID,storeID:storeID})
        updates.forEach((update) => {
            product[update] = req.body[update]
        })
        await product.save()
        res.status(200).json({
            message:`Your product has been updated successfully!`,
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


const deleteProduct = async(req, res, next) => {
    try{
        const _id = req.params.id
        const storeID = req.store._id
        const product = await Product.findOneAndDelete({_id:_id , storeID:storeID})
        if(!product){
            throw new Error('Product not found!')
        }
        res.status(200).json({
            message:`Your product has been deleted successfully!`,
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

const viewMyStoreAllProducts = async(req, res, next) => {
    try{
        const storeID = req.store._id
        const products = await Product.find({storeID: storeID})
        if(!products){
            throw new Error('Products not found!')
        }
        res.status(200).json({
            message:`Store products fetched successfully!`,
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

const viewStoreProductsSelectedByVendorsProducts = async(req, res, next) => {
    try{
        let storeID = ""
        if(req.store){
            storeID = req.store._id
        }
        else{
            storeID = req.params.id
        }
        const products = await Product.find({storeID: storeID, vendorId: {$ne: null}})
        if(!products){
            throw new Error('Products not found!')
        }
        res.status(200).json({
            message:`Vendor's products added in your store fetched successfully!`,
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

const viewStoreOwnProducts = async(req, res, next) => {
    try{
        let storeID = ""
        if(req.store){
            storeID = req.store._id
        }
        else{
            storeID = req.params.id
        }
        const products = await Product.find({storeID: storeID, vendorId: null})
        if(!products){
            throw new Error('Products not found!')
        }
        res.status(200).json({
            message:`Store products fetched successfully!`,
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

const viewMyStoreProduct = async(req, res, next) => {
    try{
        const storeID = req.store._id
        const productID = req.params.id
        const product = await Product.findOne({storeID: storeID, _id: productID})
        if(!product){
            throw new Error('Product not found!')
        }
        res.status(200).json({
            message:`Product fetched successfully!`,
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

const countMyStoreProductsStock = async(req, res, next) => {
    try{
        const storeID = req.store._id
        const products = await Product.aggregate([
            { $match: { stockAvailable: {$gte: 0}, storeID: storeID } },
            { $group: { _id: null, totalStock: { $sum: "$stockAvailable" } } }
        ])
        // if(!products){
        //     throw new Error('Products not found!')
        // }
        res.status(200).json({
            message:`Products stock count fetched successfully!`,
            data:{
                products
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const countTotalExpenseOfProducts = async(req, res, next) => {
    try{
        const storeID = req.store._id
        const products = await Product.aggregate([
            { $match: { purchasePrice: {$gte: 0}, storeID: storeID } },
            { $group: { _id: null, purchasePrice: { $sum: {$multiply: ["$purchasePrice", "$stockAvailable" ]}} } }
        ])
        // if(!products){
        //     throw new Error('Products not found!')
        // }
        res.status(200).json({
            message:`Total Expense to buy products fetched successfully!`,
            data:{
                products
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}


//FOR ADMIN 

const viewAllProductsInAllStores = async(req, res, next) => {
    try{
        const products = await Product.find({})
        if(!products){
            throw new Error('Products not found!')
        }
        res.status(200).json({
            message:`Products fetched successfully!`,
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

const viewProductDetails = async(req, res, next) => {
    try{
        const productID = req.params.id
        const product = await Product.findOne({ _id: productID})
        if(!product){
            throw new Error('Product not found!')
        }
        res.status(200).json({
            message:`Product fetched successfully!`,
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

const viewProductsOfStore = async(req, res, next) => {
    try{
        const storeID = req.params.id
        const product = await Product.findOne({storeID: storeID})
        if(!product){
            throw new Error('Store not found!')
        }
        res.status(200).json({
            message:`Store products fetched successfully!`,
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

const blockProduct = async(req, res, next) => {
    try{
        
        const productID = req.params.id
        const product = await Product.findOne({_id:productID})
        product['isVisibilityEnabled'] = false
        await product.save()
        res.status(200).json({
            message:`blocked !`,
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

const unblockProduct = async(req, res, next) => {
    try{
        
        const productID = req.params.id
        const product = await Product.findOne({_id:productID})
        product['isVisibilityEnabled'] = true
        await product.save()
        res.status(200).json({
            message:`un blocked !`,
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

const getTotalNumberOfProducts = async(req, res, next) => {
    try{
        const totalNumberOfProducts = await Product.estimatedDocumentCount()
        return res.status(200).json({
            message:`Total number of products fetched successfully!.`,
            data:{
                totalNumber: totalNumberOfProducts
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const editProductById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const updates = Object.keys(req.body)
        //validations
        // const allowedUpdated = ['name','category','description','manufactureDate','stockAvailable','price',
        // 'weight','discountPercentage','manufacturer','warranty','images','colors','isVisibilityEnabled']
        // const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
        // if(!isValidOperation || updates.length == 0){
        //     throw new Error('Invalid Keys! Please enter valid keys.')
        // }
        const productID = await Product.findById(_id)
        const product = await Product.findOne({_id:productID})
        
        updates.forEach((update) => {
            product[update] = req.body[update]
        })
        await product.save()
        res.status(200).json({
            message:`Product has been updated successfully!`,
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

const deleteProductById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const product = await Product.findOneAndDelete({_id:_id})
        if(!product){
            throw new Error('Product not found!')
        }
        res.status(200).json({
            message:`Product has been deleted successfully!`,
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

const addProductByStoreId = async(req, res, next) => {

    try{
        const storeId = req.params.id
        const store = await Store.findOne({_id: storeId})
        //check if product name added before in this store DB
        if(!store){
            throw new Error('Please register store to add Product.')
        }
        const isProductNamePresent = await Product.findOne({name:req.body.name,storeID:storeId})
        if(isProductNamePresent){
            throw new Error('Product with this name already added before.')
        }

        req.body['storeID'] = storeId
        const product = new Product(req.body)
        await product.save()
        res.status(201).json({
            message:`Product has been added successfully to store!`,
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


module.exports = {
    //SELLER
    addProductToMyStore,
    updateProduct,
    deleteProduct,
    viewMyStoreAllProducts,
    viewStoreOwnProducts,
    viewStoreProductsSelectedByVendorsProducts,
    viewMyStoreProduct,
    countMyStoreProductsStock,
    countTotalExpenseOfProducts,
    //ADMIN
    viewAllProductsInAllStores,
    viewProductDetails,
    viewProductsOfStore,
    blockProduct,
    unblockProduct,
    getTotalNumberOfProducts,
    editProductById,
    deleteProductById,
    addProductByStoreId
}