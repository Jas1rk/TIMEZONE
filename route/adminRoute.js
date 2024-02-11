const express = require('express')
const admin_router = express.Router()
const admincontroller = require('../controller/adminController')
const userlistcontroller = require('../controller/userListConstroller')
const adminCategoryController = require('../controller/categoryController')
const productcontroller = require('../controller/productController')
const multer = require('../controller/multer/multer')
const upload = require('../controller/multer/multer')

const { isAdmin } = require('../middlewares/auth')


admin_router.get('/admindash',isAdmin,admincontroller.adminDashGet)

admin_router.get('/',isAdmin,admincontroller.adiminlogGet)
admin_router.post('/',isAdmin,admincontroller.adminlogPost)
admin_router.get('/logout',isAdmin,admincontroller.logoutAdmin)



admin_router.get('/userList',isAdmin,userlistcontroller.loadUserList)
admin_router.get('/userBlock',isAdmin,userlistcontroller.blockUser)
admin_router.get('/userUnblock',isAdmin,userlistcontroller.unblockUser)


admin_router.get('/admincategory',isAdmin,adminCategoryController.admincategory)
admin_router.post('/admincategory',isAdmin,adminCategoryController.admincategoryPost)
admin_router.get('/categoryblock',isAdmin,adminCategoryController.adminCategoryBlock)
admin_router.get('/categoryunblock',isAdmin,adminCategoryController.adminCategoryUnblock)
admin_router.get('/categoryedit',isAdmin,adminCategoryController.adminCategoryEditGet)
admin_router.post('/categoryedit',isAdmin,adminCategoryController.adminCategoryEditPost)

admin_router.get('/productadmin',isAdmin,productcontroller.adminProductsGet)
admin_router.get('/addproduct',isAdmin,productcontroller.addProductGet)
admin_router.post('/addproduct',isAdmin,upload.array("image",5),productcontroller.addProductPost)







module.exports = admin_router