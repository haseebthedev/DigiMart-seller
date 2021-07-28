const mongoose=require('mongoose')
const validator=require('validator')

const promotionAudienceSchema = new mongoose.Schema({
    //All products ID's which are promoted using this audience
    productsID:{
        type: [String],
        ref: 'Product',
        required: [true,'Please enter ID of promoted product']
    },
    //Category of product, which is promoted
    productCategory:{
        type: String,
        required: [true,'Please enter category of promoted product']
    },
    //category in which audience is interested i.e category from which data is scrapped
    audienceInterestCategory:{
        type: String
    },
    audienceNames:{
        type: [String]
    },
    audienceNumbers:{
        type: [String]
    },
    audienceEmail:{
        type: [String]
    }

},{
    timestamps: true
})

//get Size of collection
promotionAudienceSchema.statics.getStorageDetails = async function() {
    const Size = await PromotionAudience.collection.stats({scale: 1024});
    return Size.totalSize
}

const PromotionAudience = mongoose.model('PromotionAudience',promotionAudienceSchema)
module.exports = PromotionAudience