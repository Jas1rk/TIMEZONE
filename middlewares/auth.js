const User = require('../model/userModel')
const Admin = require('../model/adminModel')

const isUser = async(req,res,next)=>{
    try{
        if(req.session.user){
            next()
        }else{
            redirect("/")
        }

    }catch(err){
        console.log(err.message)
    }
}



const isAdmin = async(req,res,next)=>{
    try{
        if(req.session.admin){
         Admin.findOne({email:req.session.admin}).lean()
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