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
    //refrence ID from promoted audience schema
    promotedAudienceId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'PromotionAudience'
    },
    promotionSource:{
        type: String,
        lowercase:true,
        required:[true, "Please enter source of promotion !"]
    },
    urlCode: String,
    longUrl: String,
    shortUrl: String,
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