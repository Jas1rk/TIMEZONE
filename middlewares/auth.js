const User = require('../model/userModel')
const Admin = require('../model/adminModel')

const isUser = async(req,res,next)=>{
    try{
        if(req.session.user){
            await User.findOne({email: req.session.user}).lean()
            .then((data)=>{
                if(data.isBlocked === 1){
                    res.redirect('/login')

                }else{
                    next()
                }
            })
        }

    }catch(err){
        console.log(err.message)
    }
}



const isAdmin = async(req,res,next)=>{
    try{
        if(req.session.admin){
            await Admin.findOne({email:req.session.admin}).lean()
            .then((data)=>{
                if(data){
                    next()
                }else{
                    res.redirect('/admin')
                }
            })
            .catch((error)=>{
                if(err){
                    console.error("Error",error)
                }
            })
        }

    }catch(err){
      console.log(err.message)
    }
}



module.exports = {isUser,isAdmin}