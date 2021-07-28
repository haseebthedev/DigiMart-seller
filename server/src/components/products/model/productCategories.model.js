const mongoose=require('mongoose')
const validator=require('validator')
var uniqueValidator = require('mongoose-unique-validator');

const productCategorySchema = new mongoose.Schema({
    parentCategoryName:{
        type: String
    },
    name:{
        type: String,
        required: [true,'Please enter product category name'],
        unique:[true,'Category already present!'],
        lowercase:true,
    },
    description:{
        type: String,
        required: [true,'Please enter category description']
    }
})

//get Size of collection
productCategorySchema.statics.getStorageDetails = async function() {
    const Size = await ProductCategory.collection.stats({scale: 1024});
    return Size.totalSize
}

productCategorySchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

const ProductCategory = mongoose.model('ProductCategory',productCategorySchema)
module.exports = ProductCategory