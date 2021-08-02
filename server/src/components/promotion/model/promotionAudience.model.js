const mongoose=require('mongoose')
const validator=require('validator')
var uniqueValidator = require('mongoose-unique-validator');

const promotionAudienceSchema = new mongoose.Schema({
    //All products ID's which are promoted using this audience
    // productsID:{
    //     type: [mongoose.Schema.Types.ObjectId],
    //     ref: 'Product',
    // },
    //Category of products, which can be promoted using this audience
    productCategory:{
        type: [String],
    },
    //category in which audience is interested i.e category from which data is scrapped
    audienceInterestCategory:{
        type: String,
        unique:[true,'This audience interest category already exits!'],
    },
    promotionSource:{
        type: String,
        lowercase:true,
        required:[true, "Please enter source of promotion !"]
    },
    //audience data
    promotionData:[{
        name: String,
        email: String,
        number: String
    }],
    
},{
    timestamps: true
})

//get Size of collection
promotionAudienceSchema.statics.getStorageDetails = async function() {
    const Size = await PromotionAudience.collection.stats({scale: 1024});
    return Size.totalSize
}

promotionAudienceSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
const PromotionAudience = mongoose.model('PromotionAudience',promotionAudienceSchema)
module.exports = PromotionAudience