const Product = require('../model/product.model')

const addProduct = async(req, res, next) => {

    //FOR AUTHENTICATED VENDOR
    try{
        //check if product name added before in this store DB
        const isProductNamePresent = await Product.findOne({name:req.body.name,storeID:req.store._id})
        if(isProductNamePresent){
            throw new Error('Product with this name already added before.')
        }
        req.body['storeID'] = req.store._id
        req.body['storeName'] = req.store.name
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
        const allowedUpdated = ['name','category','description','manufactureDate','stockAvailable','price',
        'weight','discountPercentage','manufacturer','warranty','images','colors','isVisibilityEnabled']
        const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
        if(!isValidOperation || updates.length == 0){
            throw new Error('Invalid Keys! Please enter valid keys.')
        }
        const productID = req.params.id
        const storeID = req.store._id
        
        const product = await Product.findOne({_id:productID,storeID:storeID})
        //console.log(product)
        updates.forEach((update) => product[update] = req.body[update])
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

const viewMyStoreProducts = async(req, res, next) => {
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
        const updates = Object.keys(req.body)
        const allowedUpdated = ['isVisibilityEnabled']
        const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
        if(!isValidOperation || updates.length == 0){
            throw new Error('Invalid Keys! Please enter valid keys.')
        }
        const productID = req.params.id
        const product = await Product.findOne({_id:productID})
        product['isVisibilityEnabled'] = req.body['isVisibilityEnabled']
        await product.save()
        res.status(200).json({
            message:`Your product has been blocked successfully!`,
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
module.exports = {
    //VENDOR
    addProduct,
    updateProduct,
    deleteProduct,
    viewMyStoreProducts,
    viewMyStoreProduct,
    //ADMIN
    viewAllProductsInAllStores,
    viewProductDetails,
    viewProductsOfStore,
    blockProduct,
    getTotalNumberOfProducts
}