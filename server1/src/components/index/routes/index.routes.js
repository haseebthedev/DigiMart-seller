const express = require('express')
const router = express.Router()
const indexController = require('../controllers/index.controller')
const auth = require('../../users/auth')

router.get('/', indexController.getIndexPageData)

module.exports = router