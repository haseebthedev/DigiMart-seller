const mongoose=require('mongoose')
const validator=require('validator')
var uniqueValidator = require('mongoose-unique-validator');

const reviewSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName:{
        type: String
    },
    storeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
    },
    storeName:{
        type: String
    },
    buyerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer',
        required: [true,'Please sign in first to add review !']
    },
    buyerName:{
        type: String
    },
    buyerEmail:{
        type: String
    },
    comment:{
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    pictures:[{
        type: String
    }],
    response:{
        type: String
    }
},
{
    //to create track of when was created or updated
    timestamps: true
})


//get Size of collection
reviewSchema.statics.getStorageDetails = async function() {
    const Size = await Review.collection.stats({scale: 1024});
    return Size.totalSize
}

reviewSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
const Review = mongoose.model('Review',reviewSchema)
module.exports = Review