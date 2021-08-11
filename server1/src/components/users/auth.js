const vendor = require('./vendor/middlewares/vendorAuth')
const buyer = require('./buyer/middlewares/buyerAuth')
const admin = require('../users/admin/middlewares/adminAuth')

module.exports = {
    vendor,
    buyer,
    admin
}