const Cart = require('../model/cartModel')
const User = require('../model/userModel')
const Product = require('../model/productModel')


const userCartGet = async(req,res)=>{
    try{
      
        
      const cartFind = await Cart.findOne({user:req.session.user._id}).populate('products.productId')
      
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
       const {id,price} = req.body;
       console.log(price);
       const userData= await User.findById({_id:userId._id})
       const productData = await Product.findOne({_id:id})
       const cartData = await Cart.findOne({user:userData._id})

       if(cartData){ 
          const existingProduct = await Cart.findOne({user:userId,'products.productId':id})
       
          console.log(existingProduct)
          if(existingProduct){
           res.json({status:'viewcart'})
           console.log('existing cart')
          }else{
           const ucData = await Cart.findOneAndUpdate({user:userData._id},{
               $push:{
                  products:{
                    productId:id,
                    quantity:1,
                    price:price
                  },
               },
               $inc:{total:price}
           })
               
            console.log('product addes in to cart',ucData)
          
            
          }
           
         

       }else{
           const uCart = await new Cart({
            user:userData._id,
            products:[{
                productId:id,
                quantity:1,
                price:price

            }],
           
           })
           console.log('user has cart',uCart)
           await uCart.save()
       }
      
    }catch(err){
        console.log(err.message)
    }
}


const quantityIncrement = async(req,res)=>{
    try{

    }catch(err){
        console.log(err.message)
    }
}

module.exports = {
    userCartGet,
    addToCart,
    quantityIncrement

}