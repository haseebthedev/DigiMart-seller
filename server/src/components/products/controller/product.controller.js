const Product = require('../model/product.model')

const addProduct = async(req, res, next) => {

    try{
        //check if product name added before in this store DB
        const isProductNamePresent = await Product.findOne({name:req.body.name,storeName:req.user.storeName})
        if(isProductNamePresent){
            throw new Error('Product with this name already added before.')
        }
        req.body['storeName'] = req.user.storeName
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
        const product = await Product.findOne({_id:productID,storeName:req.user.storeName})
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
        const product = await Product.findOneAndDelete({_id:_id , storeName:req.user.storeName})
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
module.exports = {
    addProduct,
    updateProduct,
    deleteProduct
}