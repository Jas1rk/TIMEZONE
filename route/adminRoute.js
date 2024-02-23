const express = require('express')
const admin_router = express.Router()
const admincontroller = require('../controller/adminController')
const userlistcontroller = require('../controller/userListConstroller')
const adminCategoryController = require('../controller/categoryController')
const productcontroller = require('../controller/productController')
const upload = require('../controller/multer/multer')
const middle = require('../middlewares/auth')




admin_router.get('/admindash',middle.isAdmin,admincontroller.adminDashGet)

admin_router.get('/',admincontroller.adiminlogGet)
admin_router.post('/',admincontroller.adminlogPost)
admin_router.get('/logout',admincontroller.logoutAdmin)



admin_router.get('/userList',userlistcontroller.loadUserList)
admin_router.get('/userBlock',userlistcontroller.blockUser)
admin_router.get('/userUnblock',userlistcontroller.unblockUser)


admin_router.get('/admincategory',adminCategoryController.admincategory)
admin_router.post('/admincategory',adminCategoryController.admincategoryPost)
admin_router.get('/categoryblock',adminCategoryController.adminCategoryBlock)
admin_router.get('/categoryunblock',adminCategoryController.adminCategoryUnblock)
admin_router.get('/categoryedit',adminCategoryController.adminCategoryEditGet)
admin_router.post('/categoryedit',adminCategoryController.adminCategoryEditPost)

admin_router.get('/productadmin',productcontroller.adminProductsGet)
admin_router.get('/addproduct',productcontroller.addProductGet)
admin_router.post('/addproduct',upload.array("image"),productcontroller.addProductPost)
admin_router.get('/productedit',productcontroller.adminProductEdit)
admin_router.post('/producteditpost',upload.array("image"),productcontroller.adminEditProductPost)
admin_router.get('/blockproduct',productcontroller.adminProductBloack)
admin_router.get('/unblockproduct',productcontroller.adminUnblockproduct)
admin_router.post('/deleteimage', productcontroller.deleteImage);







module.exports = admin_router