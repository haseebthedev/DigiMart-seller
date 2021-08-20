const Vendor = require('../model/vendor.model')

const addVendor = async(req, res, next) => {
    try{
        const isPresent = await Vendor.findOne({companyName: req.body.companyName})
        if(isPresent){
            res.status(200).json({
                message:` Vendor with this name is already present.`,
                data:{
                }
            })
        }
        else{
            req.body.isApproved = true
            const vendor = new Vendor(req.body)
            await vendor.save()
            res.status(201).json({
                message:`Vendor has been added successfully!`,
                data:{
                    vendor
                }
            })
        }
        
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const requestVendor = async(req, res, next) => {
    try{
        const isPresent = await Vendor.findOne({companyName: req.body.companyName})
        if(isPresent){
            res.status(200).json({
                message:` Vendor with this name is already present.`,
                data:{
                }
            })
        }
        else{
            const vendor = new Vendor(req.body)
            await vendor.save()
            res.status(201).json({
                message:`Vendor has been requested successfully!`,
                data:{
                    vendor
                }
            })
        }
        
    }
    catch(e){
        e.status = 404
        next(e)
    }
}


const deleteVendor = async(req, res, next) => {
    try{
        const _id = req.params.id
        const vendor = await Vendor.findOneAndDelete({_id:_id})
        if(!vendor){
            throw new Error('Vendor not found!')
        }
        res.status(200).json({
            message:`Vendor has been deleted successfully!`,
            data:{
                vendor
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getVendorById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const vendor = await Vendor.findOne({_id:_id})
        if(!vendor){
            throw new Error('Vendor not found!')
        }
        res.status(200).json({
            message:`Vendor has been fetched successfully!`,
            data:{
                vendor
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllVendors = async(req, res, next) => {
    try{
        const vendors = await Vendor.find({})
        res.status(200).json({
            message:`Vendors list has been fetched successfully!`,
            data:{
                vendors
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllRequestedVendors = async(req, res, next) => {
    try{
        const vendors = await Vendor.find({"isApproved": false})
        res.status(200).json({
            message:`Requests Vendors list has been fetched successfully!`,
            data:{
                vendors
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllApprovedVendors = async(req, res, next) => {
    try{
        const vendors = await Vendor.find({"isApproved": true})
        res.status(200).json({
            message:`Registered Vendors list has been fetched successfully!`,
            data:{
                vendors
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllVendorsByCategoryName = async(req, res, next) => {
    try{
        const categoryName = req.params.category
        const vendors = await Vendor.find({category: categoryName})
        res.status(200).json({
            message:`Vendors list has been fetched successfully!`,
            data:{
                vendors
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const updateVendor = async(req, res, next) => {
    try{
        const updates = Object.keys(req.body)
        const vendorID = req.params.id
        
        const vendor = await Vendor.findOne({_id:vendorID})
        updates.forEach((update) => vendor[update] = req.body[update])
        await vendor.save()
        res.status(200).json({
            message:`Vendor has been updated successfully!`,
            data:{
                vendor
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}


module.exports = {
    addVendor,
    deleteVendor,
    updateVendor,
    getVendorById,
    getAllVendors,
    getAllVendorsByCategoryName,
    getAllApprovedVendors,
    getAllRequestedVendors,
    requestVendor
}
