const mongoose=require('mongoose')
const validator=require('validator')
var uniqueValidator = require('mongoose-unique-validator');

const storeSchema = new mongoose.Schema({
    name:{
        type: String,
        unique:[true,'Store Name already exist.']
    },
    //e.g electronics, etc.
    category:{
        type: String,
        required: [true,'Please select category of store.']
    },
    city:{
        type: String,
        required: [true,'Please enter city in which store is located.']
    },
    country:{
        type: String,
        required: true,
        default:'Pakistan'
    },
    type:{
        type: String,
        required: [true,'Please select your store type i.e. individual / brand / Shop'],
        enum:['individual', 'brand' , 'shop']
    },
    warehouseAddress:{
        type: String,
    },
    buissnessAddress:{
        type: String,
        required: [true,'Please enter business address of store!']
    },
    isApprovedPromotionTool:{
        type: Boolean,
        default: false
    },
    logo:{
        type: String
    },
    isActive:{
        type: Boolean,
        default: false
    },
    biography:{
        type: String,
        default:'Buy and sell products by one click on DigiMart.'
    },
    isApproved:{
        type: Boolean,
        default: false
    },
    transactionLimit:{
        type: Number,
        default: 50000
    },
    //These fields may be used in future thats why commented
    // vendorID:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'Vendor'
    // },
    // customersID:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'Buyer'
    // }],
    earningsID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'VendorEarning'
    }
},
{
    //to create track of when user was created or updated
    timestamps: true
})

//crating index on name of store
// storeSchema.index({name: 1},{unique: true, name:'IDX_STORE_NAME'})

//get Size of collection
storeSchema.statics.getStorageDetails = async function() {
    const Size = await Store.collection.stats({scale: 1024});
    return Size.totalSize
}

storeSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
//creating model of moongoose and then creating an instance of model and then saving it
const Store = mongoose.model('Store',storeSchema)
module.exports = Store