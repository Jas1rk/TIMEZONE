const User = require('../model/userModel')
const bcrypt =  require('bcrypt')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv').config()





const userhome  = (req,res)=>{
    try{
        res.render('homepage')
    }catch(err){
        console.log(err);
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
    console.log(req.body)
    const loggedUser = await User.findOne({email})
    
    if(loggedUser){
        const passwordMatch = await bcrypt.compare(password,loggedUser.password)
        console.log(passwordMatch)
         if(passwordMatch){
            if(loggedUser.isAdmin===1){
                req.session.admin=loggedUser._id
                return res.redirect('/adminhome')
            }else{
                req.session.user = loggedUser._id
                return res.redirect('/')
            }
         }
    }else{
        res.render('userlogin',{message:"false"})
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
   const {username,email,mobile,password1,password2} = req.body
    if(!username,!email,!mobile,!password1,!password2){
        return res.status(400).json({error:"all fields are required"})
    }
    if(password1!==password2){
        return res.status(400).json({error:"password does not match"})
    }
    const existUser = await User.findOne({email:email})
    console.log(existUser)
    if(existUser){
        return res.status(400).json({message:"user is already exist"})
       
    }else{
        await emailVerification(email);

        req.session.temp = {username,email,mobile,password1,password2}
        res.redirect('/verify')
       }
 }catch(err){
    console.log(err);
 } 
}


let otpVal;
const emailVerification = async (email) => {
    try {
      otpVal = Math.floor(Math.random() * 10000).toString();
  
   console.log(otpVal)
   console.log("otp entering")
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
       
      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification Code",
        text: otpVal,
      };
  
      let info = await transporter.sendMail(mailOptions);
    } catch (error) {
     console.log(error)
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
       console.log(otp)
       console.log(otpVal)
       if(otp===otpVal){
        const {username,email,mobile,password1} = req.session.temp
        const hashedpass =  await bcrypt.hash(password1,10)
        const newUser  = new User({
            username,
            email,
            mobile,
            password:hashedpass
        })
        await newUser.save()
        res.redirect('/login')
       }
    }catch(err){
        console.log(err);
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
        const {email ,password1,password2} = req.body
        const existUser =  await User.findOne({email:email})
        if(!existUser){
            res.status(400).json({message:"User not found"})
        }else{
            emailVerification(email);
            if(password1 == password2){
                req.session.pas = password1;
                res.render('userverifyotp')
            }
        }
        
     
    }catch(err){
        console.log(err)
    }
}

const validateForgetPassOtp =async(req,res)=>{
    const otp = req.body.otp;
    if(otp == otpVal){
      
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
    forgetPassPost

}









