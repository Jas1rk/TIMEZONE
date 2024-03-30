
const Order = require('../model/orderModel')
const User = require('../model/userModel')
const Address = require('../model/addressModel')
const Cart = require('../model/cartModel')
const Product = require('../model/productModel')
const Wallet = require('../model/walletModel')
const Coupon = require('../model/couponModel')
const generateOrderid =  require('../controller/genarator')
const Razorpay = require('razorpay')
const crypto = require('crypto')

const {razorpayKeyId,razorpayKeySecret} = process.env
let razorInstance = new Razorpay({ 
    key_id: razorpayKeyId,
   key_secret: razorpayKeySecret
 })

  

const placeOrderPost = async(req,res)=>{
    try{
       const userId = req.session.user
       const userData = await User.findOne({_id:userId})
       const {cid,handlePayment,selectAddressId,couponcode} = req.body
       const addressData = await Address.findOne({_id:selectAddressId}) 

       let cartData;
       let cartProduct;

       if(handlePayment == 'cash on delevery'){
          cartData = await Cart.findOne({_id:cid}).populate('products.productId')
          cartProduct = cartData.products.map((element)=>{
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
          const coupon  = await Coupon.findOne({ccode:couponcode})
          await Coupon.findOneAndUpdate({ccode:couponcode},{$push:{user:userId}})
          res.json({status:"ordersuccess"})
          
       } else if(handlePayment == "razorpay") {
        const orderidGenarate = generateOrderid()
        cartData = await Cart.findOne({_id:cid}).populate('products.productId')
        cartProduct = cartData.products.map((element)=>{
            let productStore = {
                productId:element.productId,
                quantity:element.quantity
            }
            return productStore
          })
           const newOrder = {
            user:userData,
            address:addressData,
            products:cartProduct,
            totalamount:cartData.total,
            paymentmethod:handlePayment,
            status:'Processing',
            orderid:orderidGenarate
           }
          

           var options = {
            amount: cartData.total * 100,
            currency: "INR",
            receipt:""+orderidGenarate
            
          }
          console.log('options',options)

          razorInstance.orders.create(options, async(error,order)=>{
           
            if(!error){
                
                res.json({status:"onlinepayment", razorpayOrder:order,orderDetails:newOrder})
            }else{
                console.log(error)
            }
          })

       }   
    }catch(err){
        console.log(err.message)
    }
}

const razorpaySuccess = async(req,res)=>{
    try{
        const {orderDetails,response,cid} = req.body
        const userData = await User.findOne({email:req.session.user.email})
        console.log(userData)
        if(userData){
            let hmac = crypto.createHmac('sha256',razorpayKeySecret);
            hmac.update(response.razorpay_order_id+"|"+ response.razorpay_payment_id)
            hmac=hmac.digest("hex")

            if(hmac == response.razorpay_signature){
                const orderGet = await Order.create(orderDetails)
                if(orderGet){
                    let productSet = []
                    orderGet.products.forEach(element =>{
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
                    console.log('cart deleted',deleteCart)
                    res.json({status:'success'})
                }
            }else{
                console.log('there is error in success')
            }
        }
    }catch(err){
        console.log(err.message)
    }
}
 

const orderDetails = async(req,res)=>{
    try{
        const user = req.session.user
       
        const pages = req.query.page || 1
        const sizeOfPage = 3
        const productSkip = (pages-1) * sizeOfPage
        const productCount =  await Order.countDocuments({user:user._id})
        const numsOfPage = Math.ceil(productCount / sizeOfPage)
      const orderDetails = await Order.find({user:user._id}).sort({_id:-1}).skip(productSkip).limit(sizeOfPage)
      const currentPage = parseInt(pages)
      res.render('orderdetails',{orderDetails,numsOfPage,currentPage})
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
        const {id,paymentMethod,userID} = req.body
        const findOrder =  await Order.findOne({_id:id})
        if(paymentMethod === 'razorpay'){
            const existingWallet = await  Wallet.findOne({user:userID})
            const transactionId = generateOrderid()
            if(!existingWallet){
                const newWallet = new Wallet({
                    user:userID,
                    walletAmount:findOrder.totalamount,
                    transactions:[{
                        tid:transactionId,
                        tamount:findOrder.totalamount,
                    }]
                })
                console.log('wallet created ====>',existingWallet)
                await newWallet.save()
            }else{
              
                const tid = generateOrderid();
                await Wallet.findOneAndUpdate({ user: userID }, {
                    $inc: { walletAmount: findOrder.totalamount },
                    $push: { transactions: { tid: tid, tamount: findOrder.totalamount } }
                });
            }
        }
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
      const productCount = await Order.countDocuments({})
      const numsOfPage = Math.ceil(productCount / sizeOfPage)
      const orders = await Order.find({}).sort({_id:-1}).populate('user').skip(productSkip).limit(sizeOfPage)
      const currentPage = parseInt(pages)
     
      res.render('admin/orderlist',{orders,numsOfPage,currentPage,pages})
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
       const userId = req.session.user
       console.log('useridddd',userId);
        const {id, status} = req.body
        const findOrder = await Order.findOne({_id:id})
        const updateStatus = await Order.findById(id)
        const transactionId = generateOrderid()
        updateStatus.status=status
        const updatetedStatus = await updateStatus.save()

       
        if(updatetedStatus.status === "Cancelled"){
          let productSet = []
          updatetedStatus.products.forEach(element =>{
            let productStore = {
                productId:element.productId,
                quantity:element.quantity
            }
            productSet.push(productStore)
           
          })  
          productSet.forEach(async(element)=>{
            const product = await Product.findByIdAndUpdate({_id:element.productId},{
                $inc:{
                    stock:element.quantity
                }
            },{new:true})
          })

        }else if(updatetedStatus.status === "Returned"){
            const paymentMethod =  findOrder.paymentmethod
            if(paymentMethod === 'razorpay'){
                const findWallet = await Wallet.findOne({user:userId})
                console.log('foount user===>>',findWallet)
                if(!findWallet){
                    const newWallet = new Wallet({
                        user:userId,
                        walletAmount:findOrder.totalamount,
                        transactions:[{
                            tid:transactionId,
                            tamount:findOrder.totalamount,
                        }]
                    })
                    console.log('wallet created ====>',newWallet)
                    await newWallet.save()
                }else{
                    console.log('the wallet is exist')
                    await Wallet.findOneAndUpdate({ user: userId }, {
                        $inc: { walletAmount: findOrder.totalamount },
                        $push: { transactions: { tid: transactionId, tamount: findOrder.totalamount } }
                    });
                }
            }
           
            let productSet = []
            updatetedStatus.products.forEach(element =>{
            let productStore = {
                productId:element.productId,
                quantity:element.quantity
            }
            productSet.push(productStore)
           
          })  
          productSet.forEach(async(element)=>{
            const quantity =  element.quantity
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


const orderReturn = async(req,res)=>{
    try{
      const {id} =  req.body
      const findOrder = await Order.findOne({_id:id}) 
        if(findOrder.status === "Delivered"){
            const updateStatud = await Order.findByIdAndUpdate(id,{$set:{   status:"Requested"}})
            res.json({status:"return"})
        }else {
            console.log('order is not delivered')
        }
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
    statusChanging,
    orderReturn,
    razorpaySuccess
}