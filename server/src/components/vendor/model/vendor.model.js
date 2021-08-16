const mongoose=require('mongoose')
const validator=require('validator')
var uniqueValidator = require('mongoose-unique-validator');

const vendorSchema = new mongoose.Schema({
    //Vendor Details
    companyName:{
        type: String,
        required: true,
        unique: [true, 'Vendor with this company name already exists !']
    },
    address:{
        type: String,
        required: true
    },
    businessNumber:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    country:{
        type: String,
        default: 'Pakistan'
    },
    logo:{
        type: String
    },
    //The description which will be shown to sellers(store-admin)
    description:{
        type: String
    },
    //e.g Manufacturer, Wholesaler, Reatiler
    //drop down
    typeOfBusiness:{
        type: String,
        required: true
    },
    //e.g fashion, electronics
    //drop down
    categories:{
        type: [String],
        required: true
    },
    //contact Person Details
    contactPersonName:{
        type: String,
    },
    contactPersonDesignation:{
        type: String   
    },
    contactPersonNumber:{
        type: String   
    },
    contactPersonEmail:{
        type: String   
    },
    contactPersonPicture:{
        type: String
    },
    //for requested vendors
    isApproved:{
        type: Boolean,
        default: false
    },
    //e.g samsung, apple are authentic brands
    isAuthenticBrand:{
        type: Boolean,
        default: false
    }
},
{
    //to create track of when user was created or updated
    timestamps: true
})

//get Size of collection
vendorSchema.statics.getStorageDetails = async function() {
    const Size = await Vendor.collection.stats({scale: 1024});
    return Size.totalSize
}

vendorSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
//creating model of moongoose and then creating an instance of model and then saving it
const Vendor = mongoose.model('Vendor',vendorSchema)
module.exports = Vendor