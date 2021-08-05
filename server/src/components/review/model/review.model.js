const mongoose=require('mongoose')
const validator=require('validator')
var uniqueValidator = require('mongoose-unique-validator');

const reviewSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    storeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
    },
    buyerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer',
        required: [true,'Please sign in first to add review !']
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
    picture:{
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