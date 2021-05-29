const Vendor = require('../../users/vendor/models/vendor.model')
const Buyer = require('../../users/buyer/models/buyer.model')
const Admin = require('../../users/admin/models/admin.model')
const Store = require('../../store/model/store.model')
const Product = require('../../products/model/product.model')

const getTotalNumberOfBuyers = async(req, res, next) => {
    try{
        const totalNumberOfBuyers = await Buyer.estimatedDocumentCount()
        return res.status(200).json({
            message:`Total number of buyers fetched successfully!.`,
            data:{
                totalNumber: totalNumberOfBuyers
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const getTotalNumberOfVendors = async(req, res, next) => {
    try{
        const totalNumberOfVendors = await Vendor.estimatedDocumentCount()
        return res.status(200).json({
            message:`Total number of Vendors fetched successfully!.`,
            data:{
                totalNumber: totalNumberOfVendors
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const getAllVendorsDetails = async(req, res, next) => {
    try{
        const filters = {}
        const Vendors = await Vendor.find(filters)
        return res.status(200).json({
            message:`Vendors data fetched successfully!.`,
            data:{
                Vendors: Vendors
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const getAllBuyersDetails = async(req, res, next) => {
    try{
        const filters = {}
        const Buyers = await Buyer.find(filters)
        return res.status(200).json({
            message:`Buyers data fetched successfully!.`,
            data:{
                Buyers: Buyers
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const viewDatabaseUsage = async(req, res, next) => {
    try{
        //const db = Buyer.db.name
            const vendorSize = await Vendor.getStorageDetails()
            const buyerSize = await Buyer.getStorageDetails()
            const adminSize = await Admin.getStorageDetails()
            const storeSize = await Store.getStorageDetails()
            const productSize = await Product.getStorageDetails()
            //get total Size
            const occupiedSpace = vendorSize + buyerSize + adminSize + storeSize + productSize + ' KB'
            const totalSpace = '560 MB'

            return res.status(200).json({
                message:`Total size in KB's fetched successfully!.`,
                data:{
                    storage: {
                        occupiedSpace,
                        totalSpace,
                        vendorSize,
                        buyerSize,
                        adminSize,
                        storeSize,
                        productSize,
                    }
                }
            })
        
    }
    catch(e){
        e.status = 404
        next(e)
    }
}
module.exports = {
    getTotalNumberOfBuyers,
    getTotalNumberOfVendors,
    getAllVendorsDetails,
    getAllBuyersDetails,
    viewDatabaseUsage
}