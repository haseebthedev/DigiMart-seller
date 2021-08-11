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
    }

})

customizationSchema.statics.getStorageDetails = async function() {
    const Size = await Customization.collection.stats({scale: 1024});
    return Size.totalSize
}

const VendorCustomization = mongoose.model('VendorCustomization',customizationSchema)
module.exports = VendorCustomization