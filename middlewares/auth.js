const User = require('../model/userModel')

const isUser = async(req,res,next)=>{
    try{
        if(req.session.user){
           res.redirect('/')
        }else{
          next()
        }

    }catch(err){
        console.log(err.message)
    }
}

const isLogout = async(req,res,next)=>{
    try{
        
        if(req.session.user){
            next()
        }else{
            redirect('/')
        }
    }catch(err){
        console.log(err)
    }
}



const isAdmin = async(req,res,next)=>{
    try{
       

    }catch(err){
      console.log(err.message)
    }
}


const isBlocked = async(req,res,next)=>{
  try{
    if(req.session.user){
    const data = await User.findOne({email:req.session.user.email})
   
    if(data.isBlocked == true){
     res.render('userlogin')
    }else{
     next()
    }
}else{
    next()
}
  }catch(err){
    console.log(err)
  }
}

module.exports = {
    isUser,
    isAdmin,
    isLogout,
    isBlocked
}