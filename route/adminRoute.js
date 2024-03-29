const express = require('express')
const admin_router = express.Router()
const admincontroller = require('../controller/adminController')
const userlistcontroller = require('../controller/userListConstroller')
const adminCategoryController = require('../controller/categoryController')


admin_router.get('/admindash',admincontroller.adminDashGet)

admin_router.get('/',admincontroller.adiminlogGet)
admin_router.post('/',admincontroller.adminlogPost)
admin_router.get('/logout',admincontroller.logoutAdmin)



admin_router.get('/userList',userlistcontroller.loadUserList)
admin_router.get('/userBlock',userlistcontroller.blockUser)
admin_router.get('/userUnblock',userlistcontroller.unblockUser)


admin_router.get('/admincategory',adminCategoryController.admincategory)
admin_router.post('/admincategory',adminCategoryController.admincategoryPost)

module.exports = admin_router