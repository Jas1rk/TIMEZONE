
const Order = require('../model/orderModel')
const User = require('../model/userModel')
const Address = require('../model/addressModel')
const Cart = require('../model/cartModel')
const Product = require('../model/productModel')
const generateOrderid =  require('../controller/genarator')

const placeOrderPost = async(req,res)=>{
    try{
       const userId = req.session.user
       const userData = await User.findOne({_id:userId})
       const {cid,handlePayment,selectAddressId} = req.body
       const addressData = await Address.findOne({_id:selectAddressId}) 
       if(handlePayment == 'cash on delevery'){
          const cartData = await Cart.findOne({_id:cid}).populate('products.productId')
          const cartProduct = cartData.products.map((element)=>{
            let productStore = {
                productId:element.productId,
                quantity:element.quantity
            }
            return productStore
          })
          const orderidGenarate = generateOrderid()
          const newOrder = new Order({
               user:userData,
               address:addressData,
               products:cartProduct,
               totalamount:cartData.total,
               paymentmethod:handlePayment,
               status:'Processing',
               orderid:orderidGenarate

          })
          const getOrder = await newOrder.save()
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
          res.json({status:"ordersuccess"})
          
       }else{
        console.log('error in cash on delivery')
       }
       
    }catch(err){
        console.log(err.message)
    }
}
 

const orderDetails = async(req,res)=>{
    try{
        const user = req.session.user
      const orderDetails = await Order.find({user:user._id}).sort({_id:-1})
      console.log(orderDetails)
      res.render('orderdetails',{orderDetails})
    }catch(err){
        console.log(err.message)
    }
}

const userOrderView = async(req,res)=>{
    try{
        const orderId =  req.query._id
        const orderData = await Order.findOne({_id:orderId})
        .populate('products.productId')
        res.render('vieworder',{orderData})
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

const cancelOrder = async(req,res)=>{
    try{
      const {id} = req.body
      const findOrder =  await Order.findOne({_id:id})
      const updateOrder = await Order.findByIdAndUpdate({_id:id},{
            $set:{
                status:'Cancelled'
            }
        })
        const checkingOrder = await updateOrder.save()
        let productSet = []
        checkingOrder.products.forEach(element =>{
          let productStore = {
            productId:element.productId,
            quantity:element.quantity
          }
          productSet.push(productStore)

        })
        productSet.forEach(async(element)=>{
            const product =  await Product.findByIdAndUpdate({_id:element.productId},{
                $inc:{
                  stock:element.quantity  
                }
            },{new:true})
        })
        res.json({status:'cancel'})
    
    }catch(err){
        console.log(err.message);
    }
}


const adminOrderList = async(req,res)=>{
    try{
      const pages =  req.query.page || 1 
      const sizeOfPage =  4
      const productSkip = (pages-1) * sizeOfPage
      const productCount = await Order.find({}).sort({_id:-1}).populate('user').count()
      const numsOfPage = Math.ceil(productCount / sizeOfPage)
      const orders = await Order.find({}).sort({_id:-1}).populate('user').skip(productSkip).limit(sizeOfPage)

      const currentPage = parseInt(pages,10)
      res.render('admin/orderlist',{orders,numsOfPage,currentPage})
    }catch(err){
        cosnole.log(err.message)
    }
}

const adminOrderDetails = async(req,res)=>{
    try{
      const orderId = req.query._id
      const orderData = await Order.findOne({_id:orderId})
      .populate('products.productId')
      .populate('user')
      res.render('admin/adminorderdetails',{orderData})
    }catch(err){
        console.log(err)
    }
}

const statusChanging = async(req,res)=>{
    try{
       
        const {id, status} = req.body
        const findOrder = await Order.findOne({_id:id})
        const updateStatus = await Order.findByIdAndUpdate({_id:id},{
            $set:{status:status}
        })
        const updatetedStatus = await updateStatus.save()
        if(updatetedStatus === "Cancelled"){
          let productSet = []
          updatetedStatus.products.forEach(element =>{
            let productStore = {
                productId:element.productId,
                quantity:element.quantity
            }
            productSet.push(productStore)
            console.log(productSet,"ayachuuuuuu")
          })  
          productSet.forEach(async(element)=>{
            const product = await Product.findByIdAndUpdate({_id:element.productId},{
                $inc:{
                    stock:element.quantity
                }
            },{new:true})
          })

        }
        
        res.json({status:"updated"})
        


    }catch(err){
        console.log(err.message)
    }
}

module.exports = {
    placeOrderPost,
    successPageGet,
    orderDetails,
    userOrderView,
    cancelOrder,
    adminOrderList,
    adminOrderDetails,
    statusChanging
}