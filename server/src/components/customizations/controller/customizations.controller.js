const { vendor } = require('../../users/auth')
const Customization = require('../model/customizations.model')

const updateVendorPanelColours = async(req, res, next) => {
    try{
        //check if valid updates of vendor colour
        const updates = Object.keys(req.body)
        const allowedUpdated = ['primaryColourVendorPanel','secondaryColourVendorPanel']
        const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
        if(!isValidOperation || updates.length == 0){
            throw new Error('Invalid Keys! Please enter valid keys.')
        }
        //find and delete document containing previous colour
        const previousColourDoc = await Customization.findOneAndDelete({ primaryColourVendorPanel: { $ne: null }, 
        secondaryColourVendorPanel: { $ne: null } })
        //now add new document containg new colours
        const vendorPanelColours = await new Customization(req.body)
        await vendorPanelColours.save()
        res.status(200).json({
            message:`Vendor panel colours updated successfully!!`,
            data:{
                primaryColour: vendorPanelColours.primaryColourVendorPanel,
                secondaryColour: vendorPanelColours.secondaryColourVendorPanel
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getVendorPanelColours = async(req, res, next) => {
    try{
        const vendorPanelColours = await Customization.findOne({ primaryColourVendorPanel: { $ne: null }, 
        secondaryColourVendorPanel: { $ne: null } })
        res.status(200).json({
            message:`Vendor panel colours fetched successfully!!`,
            data:{
                primaryColour: vendorPanelColours.primaryColourVendorPanel,
                secondaryColour: vendorPanelColours.secondaryColourVendorPanel
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const updateVendorPanelLogo = async(req, res, next) => {
    try{
        //check if valid updates of vendor logo
        const updates = Object.keys(req.body)
        const allowedUpdated = ['logoVendorPanel']
        const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
        if(!isValidOperation || updates.length == 0){
            throw new Error('Invalid Keys! Please enter valid keys.')
        }
        //find and delete document containing previous logo
        const previousLogoDoc = await Customization.findOneAndDelete({ logoVendorPanel: { $ne: null } })
        //now add new document containg new logo
        const vendorPanelLogo = await new Customization(req.body)
        await vendorPanelLogo.save()
        res.status(200).json({
            message:`Vendor panel logo updated successfully!!`,
            data:{
                logo: vendorPanelLogo.logoVendorPanel
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getVendorPanelLogo = async(req, res, next) => {
    try{
        const vendorLogo = await Customization.findOne({ logoVendorPanel: { $ne: null } })
        res.status(200).json({
            message:`Vendor panel logo fetched successfully!!`,
            data:{
                logo: vendorLogo.logoVendorPanel
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}


module.exports = {
    updateVendorPanelColours,
    getVendorPanelColours,
    updateVendorPanelLogo,
    getVendorPanelLogo
}