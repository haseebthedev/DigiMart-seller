const mongoose=require('mongoose')
const validator=require('validator')
var uniqueValidator = require('mongoose-unique-validator');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please enter product name']
    },
    //drop down
    category:{
        type: String,
        required: [true,'Please select category of product.']
    },
    //drop down
    subCategory:{
        type: String,
        //required: [true,'Please select category of product.']
    },
    //drop down
    brand:{
        type: String
    },
    description:{
        type: String,
        //required:[true,'Please enter product description.']
    },
    manufactureDate:{
        type: String,
        //required: [true,'Please enter product manufacture date.']
    },
    stockAvailable:{
        type:Number,
        //required: [true,'Please enter available stock of this product.']
    },
    //price on which product is purchased
    purchasePrice:{
        type: Number,
        //required:[true,'Please enter price of product.']
    },
    //price on which product is saled
    salePrice:{
        type: Number,
        required:[true,'Please enter price of product.']
    },
    //drop down of cm, inch etc.
    dimensions:{
        type: String
    },
    shippingCost:{
        type: Number
    },
    //drop down
    //(e.g new , used, refurbed)
    state:{
        type: String
    },
    //switch
    isOnSale:{
        type: Boolean
    },
    //calculated when entered discount percentage automatically
    discountPrice:{
        type: Number
    },
    //drop down weight units
    weight:{
        type: String,
    },
    discountPercentage:{
        type: Number,
        default:0
    },
    //drop down
    warranty:{
        type: String,
        default:'Check warranty.'
    },
    images:{
        type: [String],
        //required: [true,'Please upload product image.']
    },
    //drop down
    colors:{
        type: [String],
    },
    isVisibilityEnabled:{
        type: Boolean,
        default: true
    },
    //refrences
    storeID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
},
{
    //to create track of when was created or updated
    timestamps: true
})

//get Size of collection
productSchema.statics.getStorageDetails = async function() {
    const Size = await Product.collection.stats({scale: 1024});
    return Size.totalSize
}

productSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
const Product = mongoose.model('Product',productSchema)
module.exports = Product