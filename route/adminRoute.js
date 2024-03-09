const express = require('express')
const admin_router = express.Router()
const admincontroller = require('../controller/adminController')
const userlistcontroller = require('../controller/userListConstroller')
const adminCategoryController = require('../controller/categoryController')
const productcontroller = require('../controller/productController')
const orderController = require('../controller/orderController')
const sortController = require('../controller/sortController')
const upload = require('../controller/multer/multer')
const middle = require('../middlewares/auth')






admin_router.get('/admindash',middle.isAdmin,admincontroller.adminDashGet)

admin_router.get('/',admincontroller.adiminlogGet)
admin_router.post('/',admincontroller.adminlogPost)
admin_router.get('/logout',admincontroller.logoutAdmin)



admin_router.get('/userList',middle.isAdmin,userlistcontroller.loadUserList)
admin_router.get('/userBlock',middle.isAdmin,userlistcontroller.blockUser)
admin_router.get('/userUnblock',middle.isAdmin,userlistcontroller.unblockUser)


admin_router.get('/admincategory',middle.isAdmin,adminCategoryController.admincategory)
admin_router.post('/admincategory',middle.isAdmin,adminCategoryController.admincategoryPost)
admin_router.get('/categoryblock',middle.isAdmin,adminCategoryController.adminCategoryBlock)
admin_router.get('/categoryunblock',middle.isAdmin,adminCategoryController.adminCategoryUnblock)
admin_router.get('/categoryedit',middle.isAdmin,adminCategoryController.adminCategoryEditGet)
admin_router.post('/categoryedit',middle.isAdmin,adminCategoryController.adminCategoryEditPost)
// admin_router.get('/filtercategroy',middle.isAdmin,sortController.adminFilterCategory)

admin_router.get('/productadmin',middle.isAdmin,productcontroller.adminProductsGet)
admin_router.get('/addproduct',middle.isAdmin,productcontroller.addProductGet)
admin_router.post('/addproduct',middle.isAdmin,upload.array("image"),productcontroller.addProductPost)
admin_router.get('/productedit',middle.isAdmin,productcontroller.adminProductEdit)
admin_router.post('/producteditpost',middle.isAdmin,upload.array("image"),productcontroller.adminEditProductPost)
admin_router.get('/blockproduct',middle.isAdmin,middle.isAdmin,productcontroller.adminProductBloack)
admin_router.get('/unblockproduct',middle.isAdmin,productcontroller.adminUnblockproduct)
admin_router.post('/deleteimage',middle.isAdmin,productcontroller.deleteImage);


admin_router.get('/orderslist',middle.isAdmin,orderController.adminOrderList)
admin_router.get('/orderdetails',middle.isAdmin,orderController.adminOrderDetails)
admin_router.post('/status',middle.isAdmin,orderController.statusChanging)







module.exports = admin_router