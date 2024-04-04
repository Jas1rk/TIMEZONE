
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
       const userId = req.session.user._id
       const userData = await User.findOne({_id:userId})
       const {cid,handlePayment,selectAddressId,couponcode, totalprice} = req.body
       
       
        const addressData = await Address.findOne({_id:selectAddressId}) 
        const orderidGenarate = generateOrderid()
        const transactionId1 = generateOrderid()
        const transactionId2 = generateOrderid()
        const transactionID = generateOrderid()
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

          if(totalprice > 1000) {
            res.json({status:'higherthanthousand'})
            console.log('the amount is greater 1000')
           }else{

         
          const newOrder = new Order({
               user:userData,
               address:addressData,
               products:cartProduct,
               totalamount:totalprice,
               paymentmethod:handlePayment,
               status:'Processing',
               orderid:orderidGenarate

          })
          const getOrder = await newOrder.save()
          const referalCodeFind = userData.otherRefferel
          const otherUser = await User.findOne({refferelCode:referalCodeFind})
          if(getOrder){
            const findOrder = await Order.find({user:userId})
            if(findOrder.length === 1){
                const userPayment = parseInt(250)
                const refferedUserPayment = parseInt(500)
                const userwalletChecking = await Wallet.findOneAndUpdate({user:userId},{
                    $inc:{walletAmount:userPayment},  $push: { transactions: { tid: transactionId1, tamount: userPayment ,  tstatus:'credit'} }
                })
               
               if(otherUser){ const otherUserWallet = await Wallet.findOneAndUpdate({user:otherUser._id},{
                    $inc:{walletAmount:refferedUserPayment},  $push: { transactions: { tid: transactionId2, tamount: refferedUserPayment ,  tstatus:'credit'} }
                })

                console.log('other====>>>>>',otherUserWallet)
                    }

              }

          }
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

        }
          
       } else if(handlePayment == "razorpay") {
       
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
            totalamount:totalprice,
            paymentmethod:handlePayment,
            status:'Processing',
            orderid:orderidGenarate
           }
          
           console.log('for new one',newOrder)
           var options = {
            amount: totalprice * 100,
            currency: "INR",
            receipt:""+orderidGenarate
            
          }
          console.log('options',options)

          razorInstance.orders.create(options, async(error,order)=>{
           console.log("order is",order)
            if(!error){
                
                res.json({status:"onlinepayment", razorpayOrder:order,orderDetails:newOrder})
            }else{
                console.log(error)
            }
          })

       }else if(handlePayment == 'Wallet'){

            const findWallet = await Wallet.findOne({user:userId})
            if(findWallet.walletAmount < totalprice){
                res.json({status:'lessamount'})
                console.log('amount is less')
            }else{
                const orderFromWallet = await Wallet.findOneAndUpdate({user:userId},{
                    $inc:{walletAmount:-totalprice},
                        $push:{transactions:{
                            tid:transactionID,tamount:totalprice, tstatus:'debit'
                        }}
                })
                if(orderFromWallet){
                    cartData = await Cart.findOne({_id:cid}).populate('products.productId')
                    cartProduct = cartData.products.map((element)=>{
                      let productStore = {
                          productId:element.productId,
                          quantity:element.quantity
                      }
                      return productStore
                    })
                   
                    const newOrder = new Order({
                        user:userData,
                        address:addressData,
                        products:cartProduct,
                        totalamount:totalprice,
                        paymentmethod:handlePayment,
                        status:'Processing',
                        orderid:orderidGenarate
                    })
                    const ordercreated = await newOrder.save()
                   
                    let productSet = []
                    ordercreated.products.forEach(element =>{
                        let produstStore = {
                        productId:element.productId,
                        quantity:element.quantity
                  } 
                  productSet.push(produstStore)  
                 
              })
              productSet.forEach(async(element)=>{
                 const product = await Product.findByIdAndUpdate({_id:element.productId},{
                    $inc:{stock:-element.quantity}
                 },{new:true})
              })

              const deleteCart = await Cart.findByIdAndDelete({_id:cid})
              const coupon  = await Coupon.findOne({ccode:couponcode})
              await Coupon.findOneAndUpdate({ccode:couponcode},{$push:{user:userId}})
              res.json({status:"walletordersuccess"})
              
                }
                
            }
       }   
    }catch(err){
        console.log(err.message)
    }
}

const razorpaySuccess = async(req,res)=>{
    try{
        console.log('heloooooooooo')
        const userID = req.session.user._id
        const {orderDetails,response,cid,couponcode} = req.body
        console.log('orderDEtails???????======<><><><>',orderDetails)
        const userData = await User.findOne({email:req.session.user.email})
        const transactionId1 = generateOrderid()
        const transactionId2 = generateOrderid()
        if(userData){
            let hmac = crypto.createHmac('sha256',razorpayKeySecret);
            hmac.update(response.razorpay_order_id+"|"+ response.razorpay_payment_id)
            hmac=hmac.digest("hex")

            if(hmac == response.razorpay_signature){
                const orderGet = await Order.create(orderDetails)
                console.log('order confirmed=====>>>>>>>>>>>>>>>',orderGet)
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
                    const referalCodeFind = userData.otherRefferel
                    const otherUser = await User.findOne({refferelCode:referalCodeFind})
                    
                      const findOrder = await Order.find({user:userID})
                      if(findOrder.length === 1){
                          const userPayment = parseInt(250)
                          const refferedUserPayment = parseInt(500)
                          const userwalletChecking = await Wallet.findOneAndUpdate({user:userID},{
                              $inc:{walletAmount:userPayment},  $push: { transactions: { tid: transactionId1, tamount: userPayment ,  tstatus:'credit'} }
                          })
                          const otherUserWallet = await Wallet.findOneAndUpdate({user:otherUser._id},{
                              $inc:{walletAmount:refferedUserPayment},  $push: { transactions: { tid: transactionId2, tamount: refferedUserPayment ,  tstatus:'credit'} }
                          })
                        
          
                      }
          
                    const deleteCart = await Cart.findByIdAndDelete({_id:cid})
                    const coupon  = await Coupon.findOne({ccode:couponcode})
                        await Coupon.findOneAndUpdate({ccode:couponcode},{$push:{user:userID}})
                       
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
        const transactonId = generateOrderid();
        if(paymentMethod === 'razorpay'){
         
              const wallet =  await Wallet.findOneAndUpdate({ user: userID }, {
                    $inc: { walletAmount: findOrder.totalamount },
                    $push: { transactions: { tid: transactonId, tamount: findOrder.totalamount , tstatus:'credit' } }
                });
            
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
                 
                  const wallet =  await Wallet.findOneAndUpdate({ user: userId }, {
                        $inc: { walletAmount: findOrder.totalamount },
                        $push: { transactions: { tid: transactionId, tamount: findOrder.totalamount } }
                    });
                
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


const orderCancelIndividual = async(req,res)=>{
    try{
        const userID = req.session.user
        const {productPice,productid,orderID} = req.body
        const productQuantity = parseInt(req.body.productQuantity)
        const transactionId = generateOrderid()
        const findOrder = await Order.findOne({_id:orderID})
        const productToCancel = findOrder.products.find(product => product.productId.toString() === productid);
        const paymentMethod = findOrder.paymentmethod
        if(paymentMethod === 'razorpay'){
            const wallet =  await Wallet.findOneAndUpdate({ user: userID }, {
                $inc: { walletAmount:productPice },
                $push: { transactions: { tid: transactionId, tamount: productPice , tstatus:'credit' } }
            });
        
       
        }
        productToCancel.productStatus = true
        findOrder.totalamount -=productPice;
        findOrder.save()
        console.log(paymentMethod)
        await Product.updateOne({ _id: productid }, { $inc: { stock: productQuantity } });
        res.json({status:true})
        
         

    }catch(err){
        console.error(err.message)
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
    razorpaySuccess,
    orderCancelIndividual
}