const express = require('express')
const admin_router = express.Router()
const admincontroller = require('../controller/adminController')


admin_router.get('/',admincontroller.adiminlogGet)




module.exports = admin_router