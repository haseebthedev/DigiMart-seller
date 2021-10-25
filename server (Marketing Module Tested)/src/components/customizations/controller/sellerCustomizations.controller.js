const Customization = require('../model/sellerCustomization.model')

const updateSellerPanelColours = async(req, res, next) => {
    try{
        const colors = req.body
        //check if document is present before then update it else create new
        const sellerCustomization = await Customization.findOne({})
        if(!sellerCustomization){
            const sellerPanelColours = await new Customization(req.body)
            await sellerPanelColours.save()
            res.status(201).json({
                message:`Seller panel colours added successfully!!`,
                data:{
                    primary: sellerPanelColours.primaryColour,
                    secondary: sellerPanelColours.secondaryColour
                }
            })
        }
        else{
            sellerCustomization.primaryColour = colors.primaryColour
            sellerCustomization.secondaryColour = colors.primaryColour
            await sellerCustomization.save()
            res.status(200).json({
                message:`Seller panel colours updated successfully!!`,
                data:{
                    primary: sellerCustomization.primaryColour,
                    secondary: sellerCustomization.secondaryColour
                }
            })
        }
                
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getSellerPanelColours = async(req, res, next) => {
    try{
        const sellerCustomization = await Customization.findOne({})
        res.status(200).json({
            message:`Seller panel colours fetched successfully!!`,
            data:{
                primary: sellerCustomization.primaryColour,
                secondary: sellerCustomization.secondaryColour
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const updateSellerPanelLogo = async(req, res, next) => {
    try{
        //check if document is present before then update it else create new
        const sellerCustomization = await Customization.findOne({})
        if(!sellerCustomization){
            const newSellerCustomization = await new Customization(req.body)
            await newSellerCustomization.save()
            res.status(201).json({
                message:`Seller panel logo added successfully!!`,
                data:{
                    logo: newSellerCustomization.logo
                }
            })
        }
        else{
            sellerCustomization.logo = req.body.logo
            await sellerCustomization.save()
            res.status(200).json({
                message:`Seller panel logo updated successfully!!`,
                data:{
                    logo: sellerCustomization.logo,
                }
            })
        }
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getSellerPanelLogo = async(req, res, next) => {
    try{
        const sellerCustomization = await Customization.findOne({})
        res.status(200).json({
            message:`Seller panel logo fetched successfully!!`,
            data:{
                logo: sellerCustomization.logo
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
        const sellerCustomization = await Customization.findOne({})
        if(!sellerCustomization){
            const newSellerCustomization = await new Customization(req.body)
            await newSellerCustomization.save()
            res.status(201).json({
                message:`Added successfully!`,
                data:{
                    sellerCustomization : newSellerCustomization
                }
            })
        }
        else{
            const updates = Object.keys(req.body)
            updates.forEach((update) => {
                sellerCustomization[update] = req.body[update]
            })
            await sellerCustomization.save()
            res.status(200).json({
                message:`Updated successfully!`,
                data:{
                    sellerCustomization
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
        const sellerCustomization = await Customization.findOne({})
        res.status(200).json({
            message:`Fetched !`,
            data:{
                sellerCustomization
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}
module.exports = {
    updateSellerPanelColours,
    getSellerPanelColours,
    updateSellerPanelLogo,
    getSellerPanelLogo,
    updateAllCustomizations,
    getAllCustomizations
}