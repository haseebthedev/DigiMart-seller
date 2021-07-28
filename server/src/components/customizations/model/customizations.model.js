const mongoose=require('mongoose')
const validator=require('validator')
var uniqueValidator = require('mongoose-unique-validator');

const customizationSchema = new mongoose.Schema({
    //colours
    primaryColourVendorPanel: {
        type: String
    },
    primaryColourAdminPanel: {
        type: String
    },
    primaryColourBuyerPanel:{
        type: String
    },
    secondaryColourVendorPanel: {
        type: String
    },
    secondaryColourAdminPanel: {
        type: String
    },
    secondaryColourBuyerPanel:{
        type: String
    },
    //logo
    logoVendorPanel:{
        type: String
    },
    logoAdminDPanel:{
        type: String
    },
    logoBuyerPanel:{
        type: String
    },
    //slider Images
    sliderImagesVendorPanel:{
        type:[String]
    },
    sliderImagesBuyerPanel:{
        type:[String]
    },
    //Header navigations
    headerNavigationsVendorPanel:{
        type:[String]
    },
    headerNavigationsBuyerPanel:{
        type:[String]
    },
    //Footer Links
    footerLinksBuyerPanel:{
        type:[String]
    },
    //About us Info
    aboutusInfoVendorPanel:{
        type:[String]
    },
    aboutusInfoBuyerPanel:{
        type:[String]
    },
    //contact info
    contactInfoVendorPanel:{
        type:String
    },
    contactInfoAdminPanel:{
        type:String
    },
    contactInfoBuyerPanel:{
        type:String
    },
    //privacy policy
    privacyPolicyVendorPanel:{
        type:[String]
    },
    privacyPolicyBuyerPanel:{
        type:[String]
    },

})

customizationSchema.statics.getStorageDetails = async function() {
    const Size = await Customization.collection.stats({scale: 1024});
    return Size.totalSize
}

const Customization = mongoose.model('Customization',customizationSchema)
module.exports = Customization