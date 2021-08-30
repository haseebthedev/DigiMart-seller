const mongoose=require('mongoose')
const validator=require('validator')
var uniqueValidator = require('mongoose-unique-validator');

const productCategorySchema = new mongoose.Schema({
    name:{
        type: String,
        unique:[true,'Category already present!'],
    },
    subCategory:{
        type: [{
            name: {
                type: String,
            },
            description:{
                type: String
            }
        }],
        unique:[true,'Sub-Category already present!'],
    },
    brands:{
        type:[{
            name: String,
            description: String,
            logo: String
        }]
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