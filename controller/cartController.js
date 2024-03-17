const Cart = require('../model/cartModel')
const User = require('../model/userModel')
const Product = require('../model/productModel')
const Address = require('../model/addressModel')


const userCartGet = async(req,res)=>{
    try{
      
        
      const cartFind = await Cart.findOne({user:req.session.user._id}).populate('products.productId')
      console.log("productID",cartFind)
      if(cartFind === 0){
         res.render('usercart')
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
       const userData= await User.findById({_id:userId._id})
       const productData = await Product.findOne({_id:id})
       const cartData = await Cart.findOne({user:userData._id})

       if(cartData){ 
          const existingProduct = await Cart.findOne({user:userId,'products.productId':id})
       
          if(existingProduct){
           res.json({status:'viewcartchecking'})
           
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
          
           
            res.json({status:"viewcart"})
            
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
           uCart.total = price;
           await uCart.save()
           res.json({status:true})
       }
      
      
    }catch(err){
        console.log(err.message)
    }
}


const quantityIncrement = async(req,res)=>{
    try{
        const user = req.session.user
        const {id} = req.body
        const parseQuantity = parseInt(req.body.quantity)
        const findQuantity = await Cart.findOne({user:user,'products.productId':id})
        const productData = await Product.findById({_id:id})
        const stock = productData.stock
        const price = productData.offprice
        
        let total = 0
        findQuantity.products.forEach(element=>{
                        if(element.productId == id){
                            if(element.quantity < stock){

                                if(element.quantity < 10){
                                    element.quantity +=1
                                    findQuantity.total += price
                                    res.json({status:"increment"})
                                } else{
                                    console.log('you reached limit')
                                   res.json({status:"limit"})
                                }
                            }else{
                                console.log('out of stock')
                                res.json({status:"outofstock"})
                            } 
                        }
                    })
        await findQuantity.save()


    }catch(err){
        console.log(err.message)
    }
}

const quantityDecrement = async(req,res)=>{
    try{
       const user = req.session.user
       const {id} = req.body
       const parseQuantity = parseInt(req.body.quantity)
       const productData = await Product.findOne({_id:id})
       const quantityData = await Cart.findOne({user:user,'products.productId':id})
       const stock = productData.stock
       const price = productData.offprice

      quantityData.products.forEach(element => {
        if(element.productId == id){
            if(element.quantity > 1){
                element.quantity -=1
                quantityData.total -=price
                res.json({status:"decrement"})
            }else{
                res.json({status:"minimum"})
                console.log('qunatity is already 0')
            }
        }else{
            console.log('Cannot find id  decrement')
        }
      })
      await quantityData.save()
      
    }catch(err){
      console.log(err.message)
    }
}

const cartDelete = async(req,res)=>{
    try{
     const userId = req.session.user
     const {id,quantity} = req.body
     const findCart = await Cart.findOne({user:userId,'products.productId':id})
     if(findCart){
        const productTodelete = findCart.products.find(product => product.productId == id)
        const price = productTodelete.price
        const totalDecerement =  price*productTodelete.quantity
        const deleteItem = await Cart.updateOne(
            {user:userId,'products.productId':id},
            {
                $pull:{products:{productId:id}},
                $inc:{total: -totalDecerement}
            }
        )
        console.log('delete item from cart',deleteItem)
        res.json({status:"delete"})
     }


    }catch(err){
        console.log(err.message)
    }
}



const userCheckoutGet = async(req,res)=>{
    try{
        const userId = req.session.user
        const addressData = await Address.find({user:userId})
        const cartFind = await Cart.findOne({user:userId}).populate('products.productId')
        res.render('usercheckout',{addressData,cartFind})
      
       
    }catch(err){
        console.log(err.message);
    }
}

const userCheckoutPage = async(req,res)=>{
    try{
        const userId = req.session.user
        const addressData = await Address.find({user:userId})
        const cartFind = await Cart.findOne({user:userId}).populate('products.productId')
        cartFind.products.forEach(element => {
            
            if(element.productId.stock < element.quantity){
               
                res.json({status:"checked"})
               
            }else{
              res.json({status:true})
             
            }
        })
       
    }catch(err){
        console.log(err.message)
    }
}


module.exports = {
    userCartGet,
    addToCart,
    quantityIncrement,
    quantityDecrement,
    cartDelete,
    userCheckoutGet,
    userCheckoutPage 

}