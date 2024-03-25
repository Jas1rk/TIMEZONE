const Wallet = require('../model/walletModel')


const userWalletGet = async(req,res)=>{
    try{
        const userId = req.session.user
        const findWallet = await Wallet.find({user:userId}).populate('user')
        console.log('this is wallet ====>',findWallet)
        res.render('userwallet',{findWallet})

    }catch(err){
        console.log(err.message)
    }
}


module.exports = {
    userWalletGet
}