const Cart = require('../model/cartModel')
const User = require('../model/userModel')
const Product = require('../model/productModel')


const userCartGet = async(req,res)=>{
    try{
      
        
      const cartFind = await Cart.findOne({user:req.session.user._id}).populate('products.productId')
      
      console.log('get cart',cartFind)
      if(cartFind===0){
         res.render('cart')
      }else{
        res.render('usercart',{cartFind})

      }
    }catch(err){
        console.log(err.message)
    }
}



const addToCart = async(req,res)=>{
    try{
       const userId = req.session.user
       const {id,price} = req.body
       const userData= await User.findById({_id:userId._id})
       const productData = await Product.findOne({_id:id})
       const cartData = await Cart.findOne({user:userData._id})
       console.log("finding user in cart",cartData);
       if(cartData){ 
          const existingProduct = await Cart.findOne({'products.productId':id})
       
          console.log(existingProduct)
          if(existingProduct){
           res.json({staus:'viewcart'})
          }else{
            cartData.products.push({
                productId:id,
                quantity:1,
                price:price
            })
          }
          cartData.subtotal+=price
          await cartData.save()

       }else{
           const uCart = await new Cart({
            user:userData._id,
            products:[{
                productId:id,
                quantity:1,
                price:price

            }],
            subtotal:price

           })
           console.log('user has cart',uCart)
           await uCart.save()
       }
      
    }catch(err){
        console.log(err.message)
    }
}

module.exports = {
    userCartGet,
    addToCart

}