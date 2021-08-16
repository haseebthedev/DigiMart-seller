const mongoose=require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const vendorCategorySchema = new mongoose.Schema({
    name:{
        type: String,
        unique:[true,'Category already present!'],
        required: true
    },
    description:{
        type: String,
        required: [true,'Please enter category description']
    }
})

vendorCategorySchema.statics.getStorageDetails = async function() {
    const Size = await Vendorcategory.collection.stats({scale: 1024});
    return Size.totalSize
}

vendorCategorySchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
//creating model of moongoose and then creating an instance of model and then saving it
const VendorCategory = mongoose.model('VendorCategory',vendorCategorySchema)
module.exports = VendorCategory