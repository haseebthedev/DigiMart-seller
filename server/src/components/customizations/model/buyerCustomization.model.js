const mongoose=require('mongoose')

const customizationSchema = new mongoose.Schema({
    //colours
    primaryColour: {
        type: {
            light: String,
            main: String,
            dark: String
        }
    },
    secondaryColour: {
        type: {
            light: String,
            main: String,
            dark: String
        }
    },
    //logo
    logo:{
        type: String
    },
    //slider Images
    sliderImages:{
        type:[{
            image: String,
            navigateTo: String
        }]
    },
    //bestSeller Images
    bestSellerImages:{
        type:[{
            image: String,
            navigateTo: String
        }]
    },
    //category Images
    categoryImages:{
        type:[{
            image: String,
            navigateTo: String
        }]
    },
    //category Images
    subCategoryImages:{
        type:[{
            image: String,
            navigateTo: String
        }]
    },
    //Header navigations
    headerNavigations:{
        type:[{
            name: String,
            navigateTo: String
        }]
    },
    //Footer Links
    footerLinks:{
        type:[{
            name: String,
            navigateTo: String
        }]
    },
    //About us Info
    aboutus:{
        type:mongoose.Schema.Types.Mixed
    },
    //contact info
    contactInfo:{
        type:mongoose.Schema.Types.Mixed
    },
    //privacy policy
    privacyPolicy:{
        type:String
    },

})

customizationSchema.statics.getStorageDetails = async function() {
    const Size = await Customization.collection.stats({scale: 1024});
    return Size.totalSize
}

const BuyerCustomization = mongoose.model('BuyerCustomization',customizationSchema)
module.exports = BuyerCustomization