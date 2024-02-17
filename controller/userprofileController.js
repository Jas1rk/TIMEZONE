const User = require('../model/userModel')
const bcrypt = require('bcrypt')

const userProfile = async (req, res) => {
    try {
        if (req.session.user) {
            const profileData = await User.findOne({ email: req.session.user.email })
           
            res.render('userprofile', { profileData })
        } else {
            res.redirect('/login')
        }


    } catch (err) {
        console.log(err.message)
    }
}


const userChangePassword = async (req, res) => {
    try {
        res.render('changepassword')
    } catch (err) {
        console.log(err.message)
    }
}

const changePasswordPost = async (req, res) => {
    try {
        const { currectPass, newPass, confirmPass } = req.body
        if (currectPass.trim() === '' || newPass.trim() === '' || confirmPass.trim() === '') {
           
        } else {
            const user = await User.findOne({ email: req.session.user.email })
            
            const comparePass = user.password;

            const isValid = await bcrypt.compare(currectPass, comparePass)
            if (isValid) {
                console.log(isValid)
                if (newPass.length >= 6 && /[a-zA-Z]/.test(newPass) && /\d/.test(newPass)) {
               
                    if ( newPass === confirmPass) {
                        const securedPass = await bcrypt.hash(newPass, 10);

                      const updatePass =  await User.findOneAndUpdate({email :req.session.user.email}, { $set: { password: securedPass } })
                      console.log('pasword updated',updatePass)
                        res.json({status:"success"})
                    } else {
                        console.log('passwords are  not correct')
                        res.json({status:"confirmerror"})
                    }

                }else{
                    console.log('Password should Alphebet number and 6 charecter')
                    res.json({status:"newpasserror"})
                }

            } else {
                console.log('current password  not correct')
                res.json({status:"currenterror"})
            }
        }
    } catch (err) {
        console.log(err.message)
    }
}

const addressGet = async (req, res) => {
    try {
        const addressData = await User.findOne({ email: req.session.user.email })
        console.log(addressData)
        res.render('address', { addressData })

    } catch (err) {
        console.log(err.message)
    }
}

const useraddAddress = async (req, res) => {
    try {
        res.render('useraddresss')
    } catch (err) {
        console.log(err.message)
    }
}


const userAccount = async (req, res) => {
    try {
        const accountData = await User.findOne({ email: req.session.user.email })
        res.render('useraccount', { accountData })
    } catch (err) {
        console.log(err.message)
    }
}

const userAccountEdit = async(req,res)=>{
    try{
      const accountData = await User.findOne({email:req.session.user.email})
      res.render('editaccount',{accountData})
    }catch(err){
        console.log(err.message)
    }
}

const useraccountEditPost = async(req,res)=>{
    try{
     
      const {name,email,mobile} = req.body
      const userData = await User.findOne({email:req.session.user.email})
     
      if(userData){
        const editProfile = await User.findOneAndUpdate({email:req.session.user.email},{$set:{
            username:name,
            email:email,
            mobile:mobile
        }})
        console.log("updateddata",editProfile)
        res.json({status:'success'})
      }
    }catch(err){
        console.log(err.message)
    }
}

module.exports = {
    userProfile,
    userChangePassword,
    useraddAddress,
    addressGet,
    userAccount,
    changePasswordPost,
    userAccountEdit,
    useraccountEditPost
}