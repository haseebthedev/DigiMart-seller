const mongoose=require('mongoose')
const validator=require('validator')

const promoteProductSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName:{
        type: String
    },
    productCategory:{
        type: String
    },
    description:{
        type: String
    },
    storeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
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
    //imported audience promotion
    importedAudienceData:[
        {
            name: String,
            email: String,
            number: String
        }
    ],
    importedAudiencePromotionSource:{
        type: String,
        enum:['Email', 'SMS', 'Both']
    },
    //buyer promotion
    buyerPromotionSource:{
        type: String,
        enum:['Email', 'SMS', 'Both']
    },
    selectedBuyersData:[
        {
            name: String,
            email: String,
            number: String
        }
    ],
    isPromoteToAllBuyers:{
        type: Boolean
    },
    //promotion to scrapped audience
    promotionAudienceId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PromotionAudience'
    },
    promotionAudienceCategory:{
        type: String
    },
    promotionAudiencePromotionSource:{
        type: String,
        enum:['Email', 'SMS', 'Both']
    },
    isPromoteToSavedPromotionAudience:{
        type: Boolean
    },
    //for Shorted URL
    urlCode: String,
    longUrl: String,
    shortUrl: String,
    ///for scheduling
    isPromotionScheduled:{
        type: Boolean,
        default: false
    },
    promotion_date:{
        type: Date,
        default: Date.now()
    },
    promotion_Time:{
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