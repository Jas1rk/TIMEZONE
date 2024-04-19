
const Wallet = require('../model/walletModel')
const Cart = require('../model/cartModel')
const Wishlist = require('../model/wishlistModel')
const  mongoose  = require('mongoose')


const userWalletGet = async(req,res)=>{
    try{
        const userId = req.session.user
        const objectId = new mongoose.Types.ObjectId(userId._id);
        const findWallet = await Wallet.aggregate([
          {$match:{user:objectId }},
          {$unwind:'$transactions'},
          {$sort:{'transactions.tdate':-1}},
          {$group:{
            _id:'$_id',
            user:{$first:'$user'},
            walletAmount: { $first: "$walletAmount" },
            transactions: { $push: "$transactions" }
          }}

        ])
      
        
        
        const cartFind = await Cart.findOne({user:userId}).populate('products.productId')
        const headerStatusCart = cartFind ? cartFind.products.length : 0
        const findWishlist =  await Wishlist.findOne({user:userId}).populate('products.productId')
        const headerStatusWishlist = findWishlist ? findWishlist.products.length :0

        res.render('userwallet',{
            findWallet,
            headerStatusCart,
            headerStatusWishlist
         
        })

    }catch(err){
        console.log(err.message)
    }
}


module.exports = {
    userWalletGet
}