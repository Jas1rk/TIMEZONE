const Admin = require('../model/adminModel')
const bcrypt = require('bcrypt')


const  adminDashGet = (req,res)=>{
    try{
        res.render('admin/adminhome')
    }catch(error){
        console.log(error)
    }
}

const adiminlogGet = (req,res)=>{
    try{
      res.render('admin/adminlog')
    }catch(err){
        console.log('cannot render admin page ')
    }
}


const adminlogPost = async(req,res)=>{
   
    try{
      const email = req.body.email
      const password = req.body.password
      const findAdmin = await Admin.findOne({email:email})
      console.log(findAdmin)
      if(findAdmin){
        if(findAdmin.password === password){
             const hasshedPasswordAdmin =  await bcrypt.hash(password,10)
             if(hasshedPasswordAdmin){
                res.redirect('/admin/admindash')
             }
           
        }else{
            res.redirect('/admin')
        }
    }else{
        console.log('conneot find admin')
    }
        
        //  console.log(hasshedPasswordAdmin)
    //      if(hasshedPasswordAdmin){
    //         res.redirect('/admindash')
    // //      }else{
    //         console.log("Invalid password")
    //      }
    //   }else{
    //     console.log("Cannot Find The Admin")
    //   }


    }catch(error){
        console.log(error)
    }
}



const logoutAdmin = async(req,res)=>{
    console.log('hello')
    try{
        req.session.destroy((err)=>{
            if(err){
                console.log("error in logout",err)
            }else{
                res.redirect('/admin')

            }
        })

    }catch(error){
        console.log(error.message)
    }
}



module.exports = {
    adiminlogGet,
    adminlogPost,
    adminDashGet,
    logoutAdmin
}




