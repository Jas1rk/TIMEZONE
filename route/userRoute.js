const express  = require('express')
const router = express.Router()
const usercontroller = require('../controller/userController')
const userProfileController = require('../controller/userprofileController')
const middle = require('../middlewares/auth')


router.get('/',middle.isBlocked,usercontroller.userhome)

router.get('/login',middle.isUser,usercontroller.userloginget)
router.post('/login',usercontroller.userloginPost)

router.get('/register',middle.isUser,usercontroller.registerget)
router.post('/register',usercontroller.registerPost)
router.get('/verify',middle.isUser,usercontroller.otpVerification)
router.post('/verify',usercontroller.otpVerificationPost)

router.get('/forget',middle.isUser,usercontroller.forgetPassGet)
router.post('/forget',usercontroller.forgetPassPost)
router.get("/forgotOtpPage",middle.isUser,usercontroller.verifyForgotPassOtp)
router.post('/forgetOtpValidation',usercontroller.validateForgetPassOtp)
router.get('/newPassPage',middle.isUser,usercontroller.UserNewPassGet)
router.post('/newPassPage',usercontroller.UserNewPassPost)


router.get('/products',usercontroller.productList)
router.get('/newarraival',usercontroller.newArraivals)

router.get('/userlogout',middle.isLogout,usercontroller.userLogout)


router.get('/userprofile',userProfileController.userProfile)
router.get('/changepassword',userProfileController.userChangePassword)
router.get('/address',userProfileController.addressGet)
router.get('/addressadd',userProfileController.useraddAddress)
router.get('/useraccount',userProfileController.userAccount)





module.exports =  router



