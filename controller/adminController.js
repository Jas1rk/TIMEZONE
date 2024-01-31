const User = require('../model/userModel')
const bcrypt = require('bcrypt')


const adiminlogGet = (req,res)=>{
    try{
      res.render('admin/adminlog')
    }catch(err){
        console.log('cannot render admin page ')
    }
}




module.exports = {
    adiminlogGet
}