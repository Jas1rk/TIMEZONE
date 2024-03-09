const User = require('../model/userModel')
const bcrypt =  require('bcrypt')
const nodemailer = require('nodemailer')
const Product = require('../model/productModel')
const Category = require('../model/categoryModel')
const Cart = require('../model/cartModel')
const dotenv = require('dotenv').config()




const userhome  = async(req,res)=>{
    try{
        const pages = req.query.page || 1
        const sizeOfPage = 6
        const productSkip = (pages-1)*sizeOfPage
        const productCount = await Product.find({isBlocked:false}).count()
        const numofPage = Math.ceil(productCount/sizeOfPage)
        const products = await Product.find({isBlocked:false}).skip(productSkip).limit(sizeOfPage)
        const categories = await Category.find({isBlocked:false})

        const currentPage = parseInt(pages,10)
        res.render('homepage',{products,categories,numofPage,currentPage})
    }catch(err){
        console.log(err);
    }
}

const newArraivals = async(req,res)=>{
  try {
    const pages = req.query.page || 1
    const sizeOfPage = 6
    const productSkip = (pages-1)*sizeOfPage
    const productCount = await Product.find({isBlocked:false}).count()
    const numofPage = Math.ceil(productCount/sizeOfPage)

    const currentPage = parseInt(pages,10)
    const products = await Product.find({isBlocked:false}).sort({_id:-1}).limit(sizeOfPage).skip(productSkip)
    const categories = await Category.find({isBlocked:false})
    res.render('homepage',{products,categories,numofPage,currentPage})
  } catch (error) {
    console.log(error)
  }
}


const userloginget = (req,res)=>{
    try{
        res.render('userlogin')
    }catch (err) {
       console.log(err);
    }
}

const userloginPost =  async(req,res)=>{
  try {
    const {email,password} = req.body
    const loggedUser = await User.findOne({email})
    if(!loggedUser){
        res.render('userlogin',{message:"User not Found"})
    }
    const hashedPassword = await bcrypt.compare(password,loggedUser.password)
    
    if(hashedPassword){
        if(loggedUser.isBlocked){
            res.render('userlogin',{message:"user has been blocked "})
        }
        req.session.user = loggedUser
        
        res.redirect('/')
    }else{
        console.log('invalid password')
         res.render('userlogin',{message:"invalid passwword"})
    }

  }catch(err){
    console.log(err)
  }
}




const registerget = (req,res)=>{
    try{
        res.render('userregister')
    }catch (err){
        console.log(err)
    }
}

const registerPost = async(req,res)=>{
 try{
    console.log(req.body,"body");
    const {username,email,mobile,password1,password2} = req.body
    if(!username,!email,!mobile,!password1,!password2){
       console.log('all fields required')
    }
    if(password1!==password2){
       console.log('passwords do not match')
    }else{
        const existUser = await User.findOne({email:email})
    
        if(existUser){
            res.render('userregister',{message:"user is already exist"})
          
           
        }else{
           const otpVal =  await emailVerification(email);
             console.log("oldotpto mail:",otpVal)
             req.session.temp = {username, email, mobile, password1, password2, otpVal};
    
            res.redirect('/verify')
           }
    }
  
 }catch(err){
    console.log(err);
 } 
}



const emailVerification = async (email) => {
    try {
     const otpVal = Math.floor(Math.random(4) * 10000).toString();
      console.log("otp is entering")
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.APP_PASSWORD
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
  
      let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Email Verification Code",
        text: `Your OTP is :${otpVal}`,
      };

    

      let info = await transporter.sendMail(mailOptions);
      console.log(info)
      return otpVal  
    } catch (error) {
      console.log(error)
      throw error
    }
  };



const  otpVerification =  (req,res)=>{
    try{
        res.render('userverifyotp')
    }catch(err){
        console.log(err)
    }
}

const otpVerificationPost = async(req,res)=>{
    try{
       const otp =  req.body.otp
       const storedOtp = req.session.temp.otpVal; 
       if(otp === storedOtp){
        const {username,email,mobile,password1} = req.session.temp
        const hashedpass =  await bcrypt.hash(password1,10)
        const existingUser = await User.findOne({email:email})
        if(!existingUser){
            const newUser  = new User({
                username,
                email,
                mobile,
                password:hashedpass
            });
            await newUser.save()
        }
        console.log('user saved successfully')
        res.redirect('/login')
       } else {
        console.log("invalid otp")
        res.render('userverifyotp',{message:"Invalid Otp"})
       }
    }catch(err){
        console.log(err);
    }
}



const registerResendOtp = async(req,res)=>{
    try{
       const userEmail = req.session.temp.email
       const resendOtp = await emailVerification(userEmail);
       req.session.temp.otpVal = resendOtp 
       console.log('changed otp', req.session.temp.otpVal);
       res.json({status:"resend"})
      

    }catch(err){
        console.log(err.message)
    }
}

const forgetPassGet = (req,res)=>{
   
  try{
     res.render('userforgot')
  }catch(err){
     console.log(err);
  }
}

const forgetPassPost = async(req,res)=>{
    try{  

      const { email }=req.body
      const password1 = req.body.password1
      const password2 = req.body.password2
                     
       const existingUser = await User.findOne({email:email})
       console.log(existingUser)
       if(existingUser){
        const otpVal = await emailVerification(email);
        console.log(otpVal,"kitti mooone");
        req.session.temp = {
            email:email,
            password1:password1,
            password2:password2,
            otpVal:otpVal,
            username:existingUser.username,
            mobile:existingUser.mobile
        }
        res.json({status:"success"})
       }else{
        console.log('user not found',email)
       }
           
               
    }catch(err){
        console.log(err)
    }
}

const forgetResendPost = async(req,res)=>{
    try{
        const userEmail = req.session.temp.email
        const resendOtp = await emailVerification(userEmail);
        req.session.temp.otpVal = resendOtp 
        console.log('changed otp', req.session.temp.otpVal);
        res.json({status:"resend"})
    }catch(err){
        console.log(err.message)
    }
}

const validateForgetPassOtp =async(req,res)=>{
   
   try{
    const otp = req.body.otp;
    const storedOtp = req.session.temp.otpVal
    
    if(otp === storedOtp){
        console.log('otp entered success fully')
        res.redirect('/newPassPage')
          
    }else{
        res.render('forgotpassotp',{message1:"Invalid Otp"})
        console.log("invalid otp")
    }
   }catch(err){
    console.log(err)
   }
}


const verifyForgotPassOtp = async  (req, res)=>{
    try {
        res.render("forgotpassotp")
    } catch (error) {
        console.log(error.message);
    }
}

const UserNewPassGet = async(req,res)=>{
    try{
        res.render('newpassword')
    }catch(error){
        console.log(error)
    }
}


const UserNewPassPost = async (req,res)=>{
    try{
        const {password1,password2} = req.body
        const email = req.session.temp.email
        if(password1 === password2){
            const secureHashed = await bcrypt.hash(password1,10)
            await User.updateOne({email:email},{
                $set:{password:secureHashed}
            })
            res.redirect('/login')
                
        } else{
          console.log('passwords are not match')
          res.status(400).json({message:"password not match"})

        }
    }catch (error){
       console.log(error)
    }
}



const userLogout = async(req,res)=>{
    try{
        console.log('session deleted');
        delete req.session.user
        res.redirect('/')

    }catch(err){
        console.log(err.message)
    }
}




const productList = async(req,res)=>{
    try{
      const productId = req.query._id
      req.session.productId = productId
      const productData = await Product.findOne({_id:productId})
      const categories = await Category.find({isBlocked:false})
      
      const cartFind = await Cart.findOne({user:req.session.user,"products.productId":productId})
      
      let cartStatus;
      if(cartFind){
        cartStatus=true;
      }else{
        cartStatus=false;
      }
      res.render('userproductdetails',{productData,categories,cartStatus})
    }catch(err){
        console.log(err.message)
    }
}




module.exports = {
    userhome,
    userloginget,
    userloginPost,
    registerget,
    registerPost,
    otpVerification,
    otpVerificationPost,
    forgetPassGet,
    forgetPassPost,
    validateForgetPassOtp,
    verifyForgotPassOtp,
    UserNewPassGet,
    UserNewPassPost,
    userLogout,
    productList,
    newArraivals,
    registerResendOtp,
    forgetResendPost
    

}









