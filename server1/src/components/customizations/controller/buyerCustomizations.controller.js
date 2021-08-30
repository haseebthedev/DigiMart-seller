const Customization = require('../model/buyerCustomization.model')

const updateBuyerPanelColours = async(req, res, next) => {
    try{
        const colors = req.body
        //check if document is present before then update it else create new
        const buyerCustomization = await Customization.findOne({})
        if(!buyerCustomization){
            const buyerPanelColours = await new Customization(req.body)
            await buyerPanelColours.save()
            res.status(201).json({
                message:`Buyer panel colours added successfully!!`,
                data:{
                    primary: buyerPanelColours.primaryColour,
                    secondary: buyerPanelColours.secondaryColour
                }
            })
        }
        else{
            buyerCustomization.primaryColour = colors.primaryColour
            buyerCustomization.secondaryColour = colors.primaryColour
            await buyerCustomization.save()
            res.status(200).json({
                message:`Buyer panel colours updated successfully!!`,
                data:{
                    primary: buyerCustomization.primaryColour,
                    secondary: buyerCustomization.secondaryColour
                }
            })
        }
                
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getBuyerPanelColours = async(req, res, next) => {
    try{
        const buyerCustomization = await Customization.findOne({})
        res.status(200).json({
            message:`Buyer panel colours fetched successfully!!`,
            data:{
                primary: buyerCustomization.primaryColour,
                secondary: buyerCustomization.secondaryColour
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const updateBuyerPanelLogo = async(req, res, next) => {
    try{
        //check if document is present before then update it else create new
        const buyerCustomization = await Customization.findOne({})
        if(!buyerCustomization){
            const newBuyerCustomization = await new Customization(req.body)
            await newBuyerCustomization.save()
            res.status(201).json({
                message:`Buyer panel logo added successfully!!`,
                data:{
                    logo: newBuyerCustomization.logo
                }
            })
        }
        else{
            buyerCustomization.logo = req.body.logo
            await buyerCustomization.save()
            res.status(200).json({
                message:`Buyer panel logo updated successfully!!`,
                data:{
                    logo: buyerCustomization.logo,
                }
            })
        }
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getBuyerPanelLogo = async(req, res, next) => {
    try{
        const buyerCustomization = await Customization.findOne({})
        res.status(200).json({
            message:`Buyer panel logo fetched successfully!!`,
            data:{
                logo: buyerCustomization.logo
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
        const buyerCustomization = await Customization.findOne({})
        if(!buyerCustomization){
            const newBuyerCustomization = await new Customization(req.body)
            await newBuyerCustomization.save()
            res.status(201).json({
                message:`Added successfully!`,
                data:{
                    buyerCustomization : newBuyerCustomization
                }
            })
        }
        else{
            const updates = Object.keys(req.body)
            updates.forEach((update) => {
                buyerCustomization[update] = req.body[update]
            })
            await buyerCustomization.save()
            res.status(200).json({
                message:`Updated successfully!`,
                data:{
                    buyerCustomization
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
        const buyerCustomization = await Customization.findOne({})
        res.status(200).json({
            message:`Fetched !`,
            data:{
                buyerCustomization
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

//slider images

const addBannerImage = async(req, res, next) => {
    try{
        //check if document is present before then update it else create new
        const buyerCustomization = await Customization.findOne({})
        if(!buyerCustomization){
            const newBuyerCustomization = await new Customization(req.body)
            await newBuyerCustomization.save()
            res.status(201).json({
                message:`Images Added successfully!`,
                data:{
                    SliderImages : newBuyerCustomization.sliderImages
                }
            })
        }
        else{
            const custom = await Customization.findOneAndUpdate(
                { _id: buyerCustomization._id }, 
                { $push: { sliderImages: req.body} 
                })
            res.status(200).json({
                message:`Images Updated successfully!`,
                data:{
                    SliderImages : custom.sliderImages
                }
            })
        }
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const updateBannerImageById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const customization = await Customization.findOneAndUpdate(
                { "sliderImages._id": _id  }, 
                { $set: { "sliderImages.$.image": req.body.image , "sliderImages.$.navigateTo": req.body.navigateTo} 
        })
        const custom = await Customization.findOne(
            { "sliderImages._id": _id  })
         res.status(200).json({
                message:`Images Updated successfully!`,
                data:{
                    images : custom.sliderImages
                }
        })
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const deleteBannerImageById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const customization = await Customization.findOne(
            { "sliderImages._id": _id  }
        )
        customization.sliderImages = customization.sliderImages.filter((image) => {
            return image._id != _id
        })
        await customization.save()
         res.status(200).json({
                message:`Image Deleted successfully!`,
                data:{
                    images : customization.sliderImages
                }
        })
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getBannerImageById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const customization = await Customization.findOne({ "sliderImages._id": _id  })
        let BannerImage = ""
        customization.sliderImages.forEach((image) => {
            if(image._id == _id)
            BannerImage = image
        })
         res.status(200).json({
                message:`Image fetched successfully!`,
                data:{
                    image : BannerImage
                }
        })
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllBannerImages = async(req, res, next) => {
    try{
        const customization = await Customization.findOne({})
         res.status(200).json({
                message:`Image fetched successfully!`,
                data:{
                    BannerImages: customization.sliderImages
                }
        })
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

//for Header Navigations

const addHeaderNavigation = async(req, res, next) => {
    try{
        //check if document is present before then update it else create new
        const buyerCustomization = await Customization.findOne({})
        if(!buyerCustomization){
            const newBuyerCustomization = await new Customization(req.body)
            await newBuyerCustomization.save()
            res.status(201).json({
                message:`Header Navigations Added successfully!`,
                data:{
                    HeaderNavigations : newBuyerCustomization.headerNavigations
                }
            })
        }
        else{
            const custom = await Customization.findOneAndUpdate(
                { _id: buyerCustomization._id }, 
                { $push: { headerNavigations: req.body} 
                })
            res.status(200).json({
                message:`Header Navigations Updated successfully!`,
                data:{
                    HeaderNavigations : custom.headerNavigations
                }
            })
        }
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const updateHeaderNavigationById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const customization = await Customization.findOneAndUpdate(
                { "headerNavigations._id": _id  }, 
                { $set: { "headerNavigations.$.name": req.body.name , "headerNavigations.$.navigateTo": req.body.navigateTo} 
        })
        const custom = await Customization.findOne(
            { "headerNavigations._id": _id  })
         res.status(200).json({
                message:`Header Navigations Updated successfully!`,
                data:{
                    HeaderNavigation : custom.headerNavigations
                }
        })
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const deleteHeaderNavigationById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const customization = await Customization.findOne(
            { "headerNavigations._id": _id  }
        )
        customization.headerNavigations = customization.headerNavigations.filter((name) => {
            return name._id != _id
        })
        await customization.save()
         res.status(200).json({
                message:`Header Navigation Deleted successfully!`,
                data:{
                    HeaderNavigations : customization.headerNavigations
                }
        })
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getHeaderNavigationById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const customization = await Customization.findOne({ "headerNavigations._id": _id  })
        let HeaderNavigation = ""
        customization.headerNavigations.forEach((name) => {
            if(name._id == _id)
            HeaderNavigation = name
        })
         res.status(200).json({
                message:`Header Navigation fetched successfully!`,
                data:{
                    HeaderNavigation
                }
        })
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllHeaderNavigations = async(req, res, next) => {
    try{
        const customization = await Customization.findOne({})
         res.status(200).json({
                message:`Header Navigation fetched successfully!`,
                data:{
                    HeaderNavigations: customization.headerNavigations
                }
        })
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

//for footer links

const addFooterLink = async(req, res, next) => {
    try{
        //check if document is present before then update it else create new
        const buyerCustomization = await Customization.findOne({})
        if(!buyerCustomization){
            const newBuyerCustomization = await new Customization(req.body)
            await newBuyerCustomization.save()
            res.status(201).json({
                message:`Footer Links Added successfully!`,
                data:{
                    FooterLinks : newBuyerCustomization.footerLinks
                }
            })
        }
        else{
            const custom = await Customization.findOneAndUpdate(
                { _id: buyerCustomization._id }, 
                { $push: { footerLinks: req.body} 
                })
            res.status(200).json({
                message:`Footer Links Updated successfully!`,
                data:{
                    FooterLinks : custom.footerLinks
                }
            })
        }
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const updateFooterLinkById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const customization = await Customization.findOneAndUpdate(
                { "footerLinks._id": _id  }, 
                { $set: { "footerLinks.$.name": req.body.name , "footerLinks.$.navigateTo": req.body.navigateTo} 
        })
        const custom = await Customization.findOne(
            { "footerLinks._id": _id  })
         res.status(200).json({
                message:`Footer Links Updated successfully!`,
                data:{
                    FooterLinks : custom.footerLinks
                }
        })
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const deleteFooterLinkById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const customization = await Customization.findOne(
            { "footerLinks._id": _id  }
        )
        customization.footerLinks = customization.footerLinks.filter((name) => {
            return name._id != _id
        })
        await customization.save()
         res.status(200).json({
                message:`Footer Link Deleted successfully!`,
                data:{
                    FooterLinks : customization.footerLinks
                }
        })
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getFooterLinkById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const customization = await Customization.findOne({ "footerLinks._id": _id  })
        let FooterLink = ""
        customization.footerLinks.forEach((name) => {
            if(name._id == _id)
            FooterLink = name
        })
         res.status(200).json({
                message:`Footer Link fetched successfully!`,
                data:{
                    FooterLink
                }
        })
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllFooterLinks = async(req, res, next) => {
    try{
        const customization = await Customization.findOne({})
         res.status(200).json({
                message:`Footer Link fetched successfully!`,
                data:{
                    FooterLinks: customization.footerLinks
                }
        })
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}
module.exports = {
    updateBuyerPanelColours,
    getBuyerPanelColours,
    updateBuyerPanelLogo,
    getBuyerPanelLogo,
    updateAllCustomizations,
    getAllCustomizations,
    //For banner images
    addBannerImage,
    updateBannerImageById,
    deleteBannerImageById,
    getBannerImageById,
    getAllBannerImages,
    //for header navigations
    addHeaderNavigation,
    updateHeaderNavigationById,
    deleteHeaderNavigationById,
    getHeaderNavigationById,
    getAllHeaderNavigations,
    //for footer links
    addFooterLink,
    updateFooterLinkById,
    deleteFooterLinkById,
    getFooterLinkById,
    getAllFooterLinks
}