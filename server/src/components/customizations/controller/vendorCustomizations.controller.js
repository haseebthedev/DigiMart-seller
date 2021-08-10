const Customization = require('../model/vendorCustomization.model')

const updateVendorPanelColours = async(req, res, next) => {
    try{
        const colors = req.body
        //check if document is present before then update it else create new
        const vendorCustomization = await Customization.findOne({})
        if(!vendorCustomization){
            const vendorPanelColours = await new Customization(req.body)
            await vendorPanelColours.save()
            res.status(201).json({
                message:`Vendor panel colours added successfully!!`,
                data:{
                    primary: vendorPanelColours.primaryColour,
                    secondary: vendorPanelColours.secondaryColour
                }
            })
        }
        else{
            vendorCustomization.primaryColour = colors.primaryColour
            vendorCustomization.secondaryColour = colors.primaryColour
            await vendorCustomization.save()
            res.status(200).json({
                message:`Vendor panel colours updated successfully!!`,
                data:{
                    primary: vendorCustomization.primaryColour,
                    secondary: vendorCustomization.secondaryColour
                }
            })
        }
                
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getVendorPanelColours = async(req, res, next) => {
    try{
        const vendorCustomization = await Customization.findOne({})
        res.status(200).json({
            message:`Vendor panel colours fetched successfully!!`,
            data:{
                primary: vendorCustomization.primaryColour,
                secondary: vendorCustomization.secondaryColour
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
        //check if document is present before then update it else create new
        const vendorCustomization = await Customization.findOne({})
        if(!vendorCustomization){
            const newVendorCustomization = await new Customization(req.body)
            await newVendorCustomization.save()
            res.status(201).json({
                message:`Vendor panel logo added successfully!!`,
                data:{
                    logo: newVendorCustomization.logo
                }
            })
        }
        else{
            vendorCustomization.logo = req.body.logo
            await vendorCustomization.save()
            res.status(200).json({
                message:`Vendor panel logo updated successfully!!`,
                data:{
                    logo: vendorCustomization.logo,
                }
            })
        }
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getVendorPanelLogo = async(req, res, next) => {
    try{
        const vendorCustomization = await Customization.findOne({})
        res.status(200).json({
            message:`Vendor panel logo fetched successfully!!`,
            data:{
                logo: vendorCustomization.logo
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const updateAllCustomizations = async(req, res, next) => {
    try{
        //check if document is present before then update it else create new
        const vendorCustomization = await Customization.findOne({})
        if(!vendorCustomization){
            const newVendorCustomization = await new Customization(req.body)
            await newVendorCustomization.save()
            res.status(201).json({
                message:`Added successfully!`,
                data:{
                    vendorCustomization : newVendorCustomization
                }
            })
        }
        else{
            const updates = Object.keys(req.body)
            updates.forEach((update) => {
                vendorCustomization[update] = req.body[update]
            })
            await vendorCustomization.save()
            res.status(200).json({
                message:`Updated successfully!`,
                data:{
                    vendorCustomization
                }
            })
        }
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllCustomizations = async(req, res, next) => {
    try{
        const vendorCustomization = await Customization.findOne({})
        res.status(200).json({
            message:`Fetched !`,
            data:{
                vendorCustomization
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
    getVendorPanelLogo,
    updateAllCustomizations,
    getAllCustomizations
}