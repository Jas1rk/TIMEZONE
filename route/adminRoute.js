const express = require('express')
const admin_router = express.Router()
const admincontroller = require('../controller/adminController')
const userlistcontroller = require('../controller/userListConstroller')
const adminCategoryController = require('../controller/categoryController')
const productcontroller = require('../controller/productController')
const upload = require('../controller/multer/multer')

const { isAdmin } = require('../middlewares/auth')


admin_router.get('/admindash',isAdmin,admincontroller.adminDashGet)

admin_router.get('/',admincontroller.adiminlogGet)
admin_router.post('/',admincontroller.adminlogPost)
admin_router.get('/logout',admincontroller.logoutAdmin)



admin_router.get('/userList',isAdmin,userlistcontroller.loadUserList)
admin_router.get('/userBlock',isAdmin,userlistcontroller.blockUser)
admin_router.get('/userUnblock',isAdmin,userlistcontroller.unblockUser)


admin_router.get('/admincategory',isAdmin,adminCategoryController.admincategory)
admin_router.post('/admincategory',isAdmin,adminCategoryController.admincategoryPost)
admin_router.get('/categoryblock',isAdmin,adminCategoryController.adminCategoryBlock)
admin_router.get('/categoryunblock',isAdmin,adminCategoryController.adminCategoryUnblock)
admin_router.get('/categoryedit',isAdmin,adminCategoryController.adminCategoryEditGet)
admin_router.post('/categoryedit',isAdmin,adminCategoryController.adminCategoryEditPost)

admin_router.get('/productadmin',productcontroller.adminProductsGet)
admin_router.get('/addproduct',productcontroller.addProductGet)
admin_router.post('/addproduct',upload.array("image"),productcontroller.addProductPost)
admin_router.get('/productedit',productcontroller.adminProductEdit)







module.exports = admin_router