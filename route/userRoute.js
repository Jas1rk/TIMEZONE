const express  = require('express')
const router = express.Router()
const usercontroller = require('../controller/userController')


router.get('/',usercontroller.userhome)

router.get('/login',usercontroller.userloginget)
router.post('/login',usercontroller.userloginPost)

router.get('/register',usercontroller.registerget)
router.post('/register',usercontroller.registerPost)
router.get('/verify',usercontroller.otpVerification)
router.post('/verify',usercontroller.otpVerificationPost)

router.get('/forget',usercontroller.forgetPassGet)
router.post('/forget',usercontroller.forgetPassPost)
router.get("/forgotOtpPage", usercontroller.verifyForgotPassOtp)
router.post('/forgetOtpValidation',usercontroller.validateForgetPassOtp)
router.get('/newPassPage',usercontroller.UserNewPassGet)
router.post('/newPassPage',usercontroller.UserNewPassPost)



module.exports =  router



