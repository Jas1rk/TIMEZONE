const Wallet = require('../model/walletModel')


const userWalletGet = async(req,res)=>{
    try{
        const userId = req.session.user
        const findWallet = await Wallet.findOne({user:userId})
       
        res.render('userwallet',{findWallet})

    }catch(err){
        console.log(err.message)
    }
}


module.exports = {
    userWalletGet
}