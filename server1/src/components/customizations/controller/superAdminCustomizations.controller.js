const Customization = require('../model/superAdminCustomization.model')

const updateSuperAdminPanelColours = async(req, res, next) => {
    try{
        const colors = req.body
        //check if document is present before then update it else create new
        const superAdminCustomization = await Customization.findOne({})
        if(!superAdminCustomization){
            const superAdminPanelColours = await new Customization(req.body)
            await superAdminPanelColours.save()
            res.status(201).json({
                message:`SuperAdmin panel colours added successfully!!`,
                data:{
                    primary: superAdminPanelColours.primaryColour,
                    secondary: superAdminPanelColours.secondaryColour
                }
            })
        }
        else{
            superAdminCustomization.primaryColour = colors.primaryColour
            superAdminCustomization.secondaryColour = colors.primaryColour
            await superAdminCustomization.save()
            res.status(200).json({
                message:`SuperAdmin panel colours updated successfully!!`,
                data:{
                    primary: superAdminCustomization.primaryColour,
                    secondary: superAdminCustomization.secondaryColour
                }
            })
        }
                
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getSuperAdminPanelColours = async(req, res, next) => {
    try{
        const superAdminCustomization = await Customization.findOne({})
        res.status(200).json({
            message:`SuperAdmin panel colours fetched successfully!!`,
            data:{
                primary: superAdminCustomization.primaryColour,
                secondary: superAdminCustomization.secondaryColour
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const updateSuperAdminPanelLogo = async(req, res, next) => {
    try{
        //check if document is present before then update it else create new
        const superAdminCustomization = await Customization.findOne({})
        if(!superAdminCustomization){
            const newSuperAdminCustomization = await new Customization(req.body)
            await newSuperAdminCustomization.save()
            res.status(201).json({
                message:`SuperAdmin panel logo added successfully!!`,
                data:{
                    logo: newSuperAdminCustomization.logo
                }
            })
        }
        else{
            superAdminCustomization.logo = req.body.logo
            await superAdminCustomization.save()
            res.status(200).json({
                message:`SuperAdmin panel logo updated successfully!!`,
                data:{
                    logo: superAdminCustomization.logo,
                }
            })
        }
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getSuperAdminPanelLogo = async(req, res, next) => {
    try{
        const superAdminCustomization = await Customization.findOne({})
        res.status(200).json({
            message:`SuperAdmin panel logo fetched successfully!!`,
            data:{
                logo: superAdminCustomization.logo
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
        const superAdminCustomization = await Customization.findOne({})
        if(!superAdminCustomization){
            const newSuperAdminCustomization = await new Customization(req.body)
            await newSuperAdminCustomization.save()
            res.status(201).json({
                message:`Added successfully!`,
                data:{
                    superAdminCustomization : newSuperAdminCustomization
                }
            })
        }
        else{
            const updates = Object.keys(req.body)
            updates.forEach((update) => {
                superAdminCustomization[update] = req.body[update]
            })
            await superAdminCustomization.save()
            res.status(200).json({
                message:`Updated successfully!`,
                data:{
                    superAdminCustomization
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
        const superAdminCustomization = await Customization.findOne({})
        res.status(200).json({
            message:`Fetched !`,
            data:{
                superAdminCustomization
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}
module.exports = {
    updateSuperAdminPanelColours,
    getSuperAdminPanelColours,
    updateSuperAdminPanelLogo,
    getSuperAdminPanelLogo,
    updateAllCustomizations,
    getAllCustomizations
}