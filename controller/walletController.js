const Wallet = require('../model/walletModel')


const userWalletGet = async(req,res)=>{
    try{
        const userId = req.session.user
        res.render('userwallet')

    }catch(err){
        console.log(err.message)
    }
}


module.exports = {
    userWalletGet
}