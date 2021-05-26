const express = require('express')
const router = express.Router()
const productController = require('../controller/product.controller')
const auth = require('../../users/auth')

router.post('/store/product', auth.vendor, productController.addProduct)
router.patch('/store/product/:id', auth.vendor, productController.updateProduct)
router.delete('/store/product/:id', auth.vendor, productController.deleteProduct)

module.exports = router