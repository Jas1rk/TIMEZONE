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
    console.log(loggedUser);
    if(!loggedUser){
        res.render('userlogin',{message:"User not Found"})
    }
    const hashedPassword = await bcrypt.compare(password,loggedUser.password)
    console.log(hashedPassword,"passsword");
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
        return res.status(400).json({error:"all fields are required"})
    }
    if(password1!==password2){
        return res.status(400).json({error:"password does not match"})
    }
    const existUser = await User.findOne({email:email})
    
    if(existUser){
        return res.status(400).json({message:"user is already exist"})
       
    }else{
       const otpVal =  await emailVerification(email);
         console.log("otp:",otpVal)
         req.session.temp = {username, email, mobile, password1, password2, otpVal};

        res.redirect('/verify')
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
        console.log(req.session.temp);
       const otp =  req.body.otp
       const storedOtp = req.session.temp.otpVal; 
       console.log("entered otp",otp)
       console.log("stored otp",storedOtp)
       if(otp===storedOtp){
        console.log(req.session.temp,"sesssione");
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
       }else{
        console.log("invalid otp")
        res.status(400).json({error:"invalid otp"})
       }
    }catch(err){
        console.log(err);
    }
}


const forgetPassGet = (req,res)=>{
    console.log(req.session.temp);
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
      console.log(req.body)
                     
       const existingUser = await User.findOne({email:email})
       console.log(existingUser)
       if(existingUser){
        const otpVal = await emailVerification(email);
        console.log(req.session.temp,"before modification");
        console.log(otpVal)
        req.session.temp = {
            email:email,
            password1:password1,
            password2:password2,
            otpVal:otpVal,
            username:existingUser.username,
            mobile:existingUser.mobile
        }
        console.log(req.session.temp,"after otp");
        res.redirect('/forgotOtpPage')
       }else{
        console.log('user not found',email)
       }
           
               
    }catch(err){
        console.log(err)
    }
}

const validateForgetPassOtp =async(req,res)=>{
   
   try{
    const otp = req.body.otp;
    console.log(otp)
    const storedOtp = req.session.temp.otpVal
    console.log(storedOtp)
    if(!otp || !storedOtp){
        return res.status(400).json({error:"otp could'nt find"})
    }
    console.log(req.session.temp,"temp");
    console.log(req.session.temp.password1,"password 1");
   
    if(otp === storedOtp){
        res.redirect('/newPassPage')
          
    }else{
        res.status(400).json({error:"Otp is incorrect"})
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
            .then((data)=>console.log(data))
            res.redirect('/login')
                
        } else{
          console.log('passwords are not match')
          res.status(400).json({message:"password not match"})

        }
    }catch (error){
       console.log(error)
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
    UserNewPassPost
    

}









