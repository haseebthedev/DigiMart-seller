const seller = require('./seller/middlewares/sellerAuth')
const buyer = require('./buyer/middlewares/buyerAuth')
const superAdmin = require('./super-admin/middlewares/superAdminAuth')

module.exports = {
    seller,
    buyer,
    superAdmin
}