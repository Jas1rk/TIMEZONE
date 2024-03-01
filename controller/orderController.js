
const Order = require('../model/orderModel')
const User = require('../model/userModel')
const Address = require('../model/addressModel')
const Cart = require('../model/cartModel')
const Product = require('../model/productModel')

const placeOrderPost = async(req,res)=>{
    try{
       const userId = req.session.user
       const userData = await User.findOne({_id:userId})
       const {cid,handlePAyment,selectAddressId} = req.body
       const addressData = await Address.findOne({_id:selectAddressId}) 
       
       if(handlePAyment == 'cash on delevery'){
          const cartData = await Cart.findOne({_id:cid}).populate('products.productId')
          const cartProduct = cartData.products.map((element)=>{
            let productStore = {
                productId:element.productId,
                quantity:element.quantity
            }
            return productStore
          })
          const newOrder = new Order({
               user:userData,
               address:selectAddressId,
               products:cartProduct,
               totalamount:cartData.total,
               paymentmethod:handlePAyment,
               status:'Processing'

          })
          const getOrder = await newOrder.save()
          console.log('order created',getOrder)
          let productSet = []
          getOrder.products.forEach(element =>{
            let productStore = {
                productId:element.productId,
                quantity:element.quantity
            }
            productSet.push(productStore)
          })
          productSet.forEach(async(element)=>{
            const product = await Product.findByIdAndUpdate({_id:element.productId},{
                $inc: {stock: -element.quantity}
            },{new: true})
          
          })
          const deleteCart = await Cart.findByIdAndDelete({_id:cid})
          console.log('deleted cart ',deleteCart)
          
          res.json({status:"ordersuccess"})
          
       }else{
        console.log('error in cash on delivery')
       }
       
    }catch(err){
        console.log(err.message)
    }
}


const successPageGet = async(req,res)=>{
    try{

      res.render('ordersuccess')
    }catch(err){
        console.log(err.message)
    }
}


module.exports = {
    placeOrderPost,
    successPageGet
}