const Customization = require('../model/adminCustomization.model')


const updateAdminPanelColours = async(req, res, next) => {
    try{
        if(!req.user.roles.includes('Super Admin')){
            throw new Error('Not authorized as a super Admin!')
        }
        const colors = req.body
        //check if document is present before then update it else create new
        const adminCustomization = await Customization.findOne({})
        if(!adminCustomization){
            const adminPanelColours = await new Customization(req.body)
            await adminPanelColours.save()
            res.status(201).json({
                message:`Admin panel colours added successfully!!`,
                data:{
                    primary: adminPanelColours.primaryColour,
                    secondary: adminPanelColours.secondaryColour
                }
            })
        }
        else{
            adminCustomization.primaryColour = colors.primaryColour
            adminCustomization.secondaryColour = colors.primaryColour
            await adminCustomization.save()
            res.status(200).json({
                message:`Admin panel colours updated successfully!!`,
                data:{
                    primary: adminCustomization.primaryColour,
                    secondary: adminCustomization.secondaryColour
                }
            })
        }
                
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAdminPanelColours = async(req, res, next) => {
    try{
        const adminCustomization = await Customization.findOne({})
        res.status(200).json({
            message:`Admin panel colours fetched successfully!!`,
            data:{
                primary: adminCustomization.primaryColour,
                secondary: adminCustomization.secondaryColour
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const updateAdminPanelLogo = async(req, res, next) => {
    try{
        if(!req.user.roles.includes('Super Admin')){
            throw new Error('Not authorized as a super Admin!')
        }
        //check if document is present before then update it else create new
        const adminCustomization = await Customization.findOne({})
        if(!adminCustomization){
            const newAdminCustomization = await new Customization(req.body)
            await newAdminCustomization.save()
            res.status(201).json({
                message:`Admin panel logo added successfully!!`,
                data:{
                    logo: newAdminCustomization.logo
                }
            })
        }
        else{
            adminCustomization.logo = req.body.logo
            await adminCustomization.save()
            res.status(200).json({
                message:`Admin panel logo updated successfully!!`,
                data:{
                    logo: adminCustomization.logo,
                }
            })
        }
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAdminPanelLogo = async(req, res, next) => {
    try{
        const adminCustomization = await Customization.findOne({})
        res.status(200).json({
            message:`Admin panel logo fetched successfully!!`,
            data:{
                logo: adminCustomization.logo
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
        if(!req.user.roles.includes('Super Admin')){
            throw new Error('Not authorized as a super Admin!')
        }
        //check if document is present before then update it else create new
        const adminCustomization = await Customization.findOne({})
        if(!adminCustomization){
            const newAdminCustomization = await new Customization(req.body)
            await newAdminCustomization.save()
            res.status(201).json({
                message:`Added successfully!`,
                data:{
                    adminCustomization : newAdminCustomization
                }
            })
        }
        else{
            const updates = Object.keys(req.body)
            updates.forEach((update) => {
                adminCustomization[update] = req.body[update]
            })
            await adminCustomization.save()
            res.status(200).json({
                message:`Updated successfully!`,
                data:{
                    adminCustomization
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
        const adminCustomization = await Customization.findOne({})
        res.status(200).json({
            message:`Fetched !`,
            data:{
                adminCustomization
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}
module.exports = {
    updateAdminPanelColours,
    getAdminPanelColours,
    updateAdminPanelLogo,
    getAdminPanelLogo,
    updateAllCustomizations,
    getAllCustomizations
}