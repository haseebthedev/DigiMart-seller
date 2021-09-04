const mongoose=require('mongoose')
const validator=require('validator')
var uniqueValidator = require('mongoose-unique-validator');

const productCategorySchema = new mongoose.Schema({
    //Product Main category
    mainCategoryName:{
        type: String,
        required:[true,'Please enter category name!'],
    },
    mainCategoryDescription:{
        type: String,
    },

    //Product Sub category
    subCategories:{
        type:[{
            name:{
                type: String,
                required:[true,'Please enter sub-category name!'],
            },
            description:{
                type: String,
            },
        }]
    },
    //Select Vendor Category
    vendorCategory:{
        type: String,
        required: [true, 'Please select vendor category!']
    },
    //Select Vendor
    vendorName:{
        type: String,
        required: [true, 'Please select vendor!']
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