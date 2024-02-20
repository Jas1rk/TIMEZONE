const Address = require('../model/addressModel')
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

                    if (newPass === confirmPass) {
                        const securedPass = await bcrypt.hash(newPass, 10);

                        const updatePass = await User.findOneAndUpdate({ email: req.session.user.email }, { $set: { password: securedPass } })
                        console.log('pasword updated', updatePass)
                        res.json({ status: "success" })
                    } else {
                        console.log('passwords are  not correct')
                        res.json({ status: "confirmerror" })
                    }

                } else {
                    console.log('Password should Alphebet number and 6 charecter')
                    res.json({ status: "newpasserror" })
                }

            } else {
                console.log('current password  not correct')
                res.json({ status: "currenterror" })
            }
        }
    } catch (err) {
        console.log(err.message)
    }
}

const addressGet = async (req, res) => {
    try {
        const userId = req.session.user
        const addressData = await Address.find({ user: userId })
        const userData = await User.findOne({email:req.session.user.email})
        res.render('address', { addressData,userData })

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

const addAddressPost = async (req, res) => {
    try {

        const userFind = await User.findOne({ email: req.session.user.email })
      
        if (userFind) {
            const { name, mobile, address, pincode, location, city, sate, country, addresstype } = req.body
            const addressData = await new Address({
                user: userFind._id,
                uname: name,
                umobile: mobile,
                uaddress: address,
                upin: pincode,
                ulocation: location,
                ucity: city,
                ustate: sate,
                ucountry: country,
                uaddresstype: addresstype

            })
            await addressData.save()
            res.json({ status: "success" })
        } else {
            console.log("Cannot find User")

        }

    } catch (err) {
        console.log(err)
    }
}

const deletAddress = async(req,res)=>{
    try{
       
    }catch(err){
        console.log(err.message)
    }
}

const addressEditGet = async(req,res)=>{
    try{
        const addressID = req.query._id
        req.session.addressid = addressID
        const addressDataId = await Address.findOne({_id:addressID})
        res.render('addressedit',{addressDataId})
       
    }catch(err){
        console.log(err.message)
    }
}

const addressEditPost = async(req,res)=>{
    try{
       
      const findAddress = await Address.findOne({_id:req.session.addressid})
      if(findAddress){
        const { name, mobile, address, pincode, location, city, sate, country, addresstype } = req.body
        const uData = {
            uname: name,
            umobile: mobile,
            uaddress: address,
            upin: pincode,
            ulocation: location,
            ucity: city,
            ustate: sate,
            ucountry: country,
            uaddresstype: addresstype
        }
        console.log(uData)
        const updateAddress = await Address.updateOne({_id:findAddress._id},{$set:uData})
       
        console.log("updatted data",updateAddress);
        if(updateAddress.modifiedCount===1){
            res.json({status:"success"})
        }else{
            console.log('no changes found')
        }
       
      }else{
        console.log('connot find ')
      }
      
     
    }catch(err){
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

const userAccountEdit = async (req, res) => {
    try {
        const accountData = await User.findOne({ email: req.session.user.email })
        res.render('editaccount', { accountData })
    } catch (err) {
        console.log(err.message)
    }
}

const useraccountEditPost = async (req, res) => {
    try {

        const { name, email, mobile } = req.body
        const userData = await User.findOne({ email: req.session.user.email })

        if (userData) {
            const editProfile = await User.findOneAndUpdate({ email: req.session.user.email }, {
                $set: {
                    username: name,
                    email: email,
                    mobile: mobile
                }
            })
            console.log("updateddata", editProfile)
            res.json({ status: 'success' })
        }
    } catch (err) {
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
    useraccountEditPost,
    addAddressPost,
    addressEditGet,
    addressEditPost,
    deletAddress
}


