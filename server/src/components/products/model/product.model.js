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
    description:{
        type: String,
        required:[true,'Please enter product description.']
    },
    manufactureDate:{
        type: String,
        required: [true,'Please enter product manufacture date.']
    },
    stockAvailable:{
        type:Number,
        required: [true,'Please enter available stock of this product.']
    },
    price:{
        type: Number,
        required:[true,'Please enter price of product.']
    },
    //drop down weight units
    weight:{
        type: Number,
    },
    discountPercentage:{
        type: Number,
        default:0
    },
    //drop down
    manufacturer:{
        type: String,
        required: [true,'Please enter maunufacturer of product.']
    },
    //drop down
    warranty:{
        type: String,
        default:'Check warranty.'
    },
    images:{
        type: [String],
        required: [true,'Please upload product image.']
    },
    colors:{
        type: [String],
    },
    //refrences
    storeName:{
        type: String,
        unique:false
    },
    isVisibilityEnabled:{
        type: Boolean,
        default: true
    }
    //to be used in future
    // reviews:[{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Reviews'
    // }],
},
{
    //to create track of when was created or updated
    timestamps: true
})

//crating index on name of store
productSchema.index({storeName: 1},{unique: true, name:'IDX_STORE_NAME'})

productSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
const Product = mongoose.model('Product',productSchema)
module.exports = Product