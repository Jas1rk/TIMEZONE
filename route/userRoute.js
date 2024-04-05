const express  = require('express')
const router = express.Router()
const usercontroller = require('../controller/userController')
const userProfileController = require('../controller/userprofileController')
const userCartController = require('../controller/cartController')
const sortcontroller = require('../controller/sortController')
const ordercontroller = require('../controller/orderController')
const wishlistcontroller =  require('../controller/wishlistController')
const walletcontroller = require('../controller/walletController')
const couponController = require('../controller/couponController')
const middle = require('../middlewares/auth')


router.get('/',middle.isBlocked,usercontroller.userhome)

router.get('/login',middle.isUser,usercontroller.userloginget)
router.post('/login',usercontroller.userloginPost)

router.get('/register',middle.isUser,usercontroller.registerget)
router.post('/register',usercontroller.registerPost)
router.get('/verify',middle.isUser,usercontroller.otpVerification)
router.post('/verify',usercontroller.otpVerificationPost)
router.post('/registerresend',usercontroller.registerResendOtp)
router.get('/forget',middle.isUser,usercontroller.forgetPassGet)
router.post('/forget',usercontroller.forgetPassPost)
router.get("/forgotOtpPage",middle.isUser,usercontroller.verifyForgotPassOtp)
router.post('/forgetOtpValidation',usercontroller.validateForgetPassOtp)
router.post('/forgetresend',usercontroller.forgetResendPost)
router.get('/newPassPage',middle.isUser,usercontroller.UserNewPassGet)
router.post('/newPassPage',usercontroller.UserNewPassPost)


router.get('/products',middle.isproductBlock,usercontroller.productList)
router.get('/newarraival',middle.isproductBlock,usercontroller.newArraivals)

router.get('/sort',sortcontroller.sortItems)
router.get('/filter',sortcontroller.filterCategory)
router.post('/search',sortcontroller.searchProducts)
router.post('/searchorder',sortcontroller.searchOrder)
// router.get('/filtercat',sortcontroller.filterProducts)


router.get('/userlogout',middle.isLogout,usercontroller.userLogout)


router.get('/userprofile',middle.isLogged,userProfileController.userProfile)
router.get('/changepassword',middle.isLogged,userProfileController.userChangePassword)
router.post('/changepassword',middle.isLogged,userProfileController.changePasswordPost)
router.get('/address',middle.isLogged,userProfileController.addressGet)
router.get('/addressadd',middle.isLogged,userProfileController.useraddAddress)
router.post('/addressadd',userProfileController.addAddressPost)
router.get('/addressedit',middle.isLogged,userProfileController.addressEditGet)
router.post('/addressedit',userProfileController.addressEditPost)
router.get('/useraccount',middle.isLogged,userProfileController.userAccount)
router.get('/useraccountedit',middle.isLogged,userProfileController.userAccountEdit)
router.post('/useraccountedit',userProfileController.useraccountEditPost)
router.get('/deleteaddress',userProfileController.deletAddress)



router.get('/usercart',middle.isLogged,userCartController.userCartGet)
router.post('/usercart',middle.isLogged,userCartController.addToCart)
router.post('/increment',userCartController.quantityIncrement)
router.post('/decrement',userCartController.quantityDecrement)
router.delete('/deletecart',userCartController.cartDelete)
router.get('/checkout',middle.isLogged,userCartController.userCheckoutGet)
router.get('/checkoutpage',middle.isLogged,userCartController.userCheckoutPage)

router.post('/placeorder',ordercontroller.placeOrderPost)
router.get('/orders',middle.isLogged,ordercontroller.orderDetails)
router.get('/vieworder',middle.isLogged,ordercontroller.userOrderView)
router.post('/cancelorder',ordercontroller.cancelOrder)
router.get('/success',middle.isLogged,ordercontroller.successPageGet)
router.post('/return',ordercontroller.orderReturn)
router.post('/razorsuccess',ordercontroller.razorpaySuccess)
router.post('/razorpayfailed',ordercontroller.razorpayFailed)
router.post('/payagain',ordercontroller.payAgain)
router.post('/paymentsucces',ordercontroller.pendingPaymentSuccess)
router.post('/individualcancel',ordercontroller.orderCancelIndividual)


router.get('/wishlist',middle.isLogged,wishlistcontroller.getWishlistPage)
router.post('/wishlist',middle.isLogged,wishlistcontroller.addToWishlist)
router.delete('/deletewishlist',wishlistcontroller.userDeleteWishlist)


router.get('/wallet',middle.isLogged,walletcontroller.userWalletGet)

router.post('/applycoupon',couponController.userApplyCoupon)

module.exports =  router



