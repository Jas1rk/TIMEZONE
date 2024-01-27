const express  = require('express')
const router = express.Router()
const usercontroller = require('../controller/userController')



router.get('/',usercontroller.userloginget)

router.get('/homepage',usercontroller.userhome)


router.get('/register',usercontroller.registerget)


module.exports =  router



