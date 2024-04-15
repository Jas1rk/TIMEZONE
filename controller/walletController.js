
const Wallet = require('../model/walletModel')
const Cart = require('../model/cartModel')
const Wishlist = require('../model/wishlistModel')


const userWalletGet = async(req,res)=>{
    try{
        const userId = req.session.user
        const findWallet = await Wallet.find({user:userId})
        .populate('user')
        .sort({transactions:1})
        
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