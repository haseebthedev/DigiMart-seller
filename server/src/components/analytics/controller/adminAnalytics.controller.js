const Seller = require('../../users/seller/models/seller.model')
const Buyer = require('../../users/buyer/models/buyer.model')
const Admin = require('../../users/super-admin/models/superAdmin.model')
const Store = require('../../store/model/store.model')
const Product = require('../../products/model/product.model')


const viewDatabaseUsage = async(req, res, next) => {
    try{
        //const db = Buyer.db.name
            const sellerSize = await Seller.getStorageDetails()
            const buyerSize = await Buyer.getStorageDetails()
            const adminSize = await Admin.getStorageDetails()
            const storeSize = await Store.getStorageDetails()
            const productSize = await Product.getStorageDetails()
            //get total Size
            const occupiedSpace = sellerSize + buyerSize + adminSize + storeSize + productSize + ' KB'
            const totalSpace = '560 MB'

            return res.status(200).json({
                message:`Total size in KB's fetched successfully!.`,
                data:{
                    storage: {
                        occupiedSpace,
                        totalSpace,
                        sellerSize,
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
    viewDatabaseUsage
}