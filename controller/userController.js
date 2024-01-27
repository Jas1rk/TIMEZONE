const User = require('../model/userModel')

const userloginget = (req,res)=>{
    try{
        res.render('userlogin')
    }catch (err) {
       console.log(err);
    }
}


const userhome  = (req,res)=>{
    try{
        res.render('homepage')
    }catch(err){
        console.log(err);
    }
}




const registerget = (req,res)=>{
    try{
        res.render('userregister')
    }catch (err){
        console.log(err)
    }
}






module.exports = {
    userloginget,
    userhome,
    registerget
}