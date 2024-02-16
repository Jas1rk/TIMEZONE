const User = require('../model/userModel')

const userProfile = async(req,res)=>{
    try{
        if(req.session.user){
            const profileData = await User.findOne({email:req.session.user.email})
            console.log(profileData)
            res.render('userprofile',{profileData})
        }else{
            res.redirect('/login')
        }
       

    }catch(err){
        console.log(err.message)
    }
}


const userChangePassword = async(req,res)=>{
    try{
      res.render('changepassword')
    }catch(err){
        console.log(err.message)
    }
}

const addressGet = async(req,res)=>{
    try{
       const addressData = await User.findOne({email:req.session.user.email})
       console.log(addressData)
       res.render('address',{addressData})
  
    }catch(err){
        console.log(err.message)
    }
}

const useraddAddress = async(req,res)=>{
    try{
       res.render('useraddresss')
    }catch(err){
        console.log(err.message)
    }
}


const userAccount = async(req,res)=>{
    try{
      const accountData = await User.findOne({email:req.session.user.email})
      res.render('useraccount',{accountData})
    }catch(err){
        console.log(err.message)
    }
}


module.exports = {
    userProfile,
    userChangePassword,
    useraddAddress,
    addressGet,
    userAccount
}