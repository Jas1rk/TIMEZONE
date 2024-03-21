const User = require('../model/userModel')


const loadUserList = async(req,res)=>{
    try{
        const user = await User.find({})
        res.render('admin/userlist',{user})

    }catch(error){
        console.log(error)
    }
}


const blockUser = async(req,res)=>{
    try{
       
        const userData = req.query._id
        console.log(userData)
        const data = await User.findByIdAndUpdate(userData,{ isBlocked:true})
        res.redirect('/admin/userList')
        
    }catch(error){
        console.log(error.message)
    }
}



const unblockUser = async(req,res)=>{
    try{
        const userData = req.query._id
       
        const data = await User.findByIdAndUpdate(userData,{ isBlocked:false})
        res.redirect('/admin/userList')


    }catch(error){
        console.log(error.message)
    }
}






module.exports = {
    loadUserList,
    blockUser,
    unblockUser,
    
    
}