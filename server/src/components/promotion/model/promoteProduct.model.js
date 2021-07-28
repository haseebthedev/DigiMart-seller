const mongoose=require('mongoose')
const validator=require('validator')

const promoteProductSchema = new mongoose.Schema({
    productId:{
        type: String,
        required: [true,'Please enter productId !'],
        ref: 'Product'
    },
    promoCode:{
        type: String
    },
    discount:{
        type: Number
    },
    promotionMessage:{
        type: String,
        required: [true,'Please enter promotion message !']
    },
    //refrence ID from promoted audience schema
    promotedAudience:{
        type: String
    },
    promotionSource:{
        type: String,
        required:[true, "Please enter source of promotion !"]
    },
    productShortenedURL:{
        type: String
    }
},{
    timestamps: true
})

//get Size of collection
promoteProductSchema.statics.getStorageDetails = async function() {
    const Size = await PromoteProduct.collection.stats({scale: 1024});
    return Size.totalSize
}

const PromoteProduct = mongoose.model('PromoteProduct',promoteProductSchema)
module.exports = PromoteProduct