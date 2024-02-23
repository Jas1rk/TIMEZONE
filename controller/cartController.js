const Cart = require('../model/cartModel')
const User = require('../model/userModel')
const Product = require('../model/productModel')


const userCartGet = async(req,res)=>{
    try{
      
        
      const cartFind = await Cart.findOne({user:req.session.user._id}).populate('products.productId')
      
      if(cartFind===0){
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
           console.log('user has cart',uCart)
           await uCart.save()
           res.json({status:"true"})
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
                                    res.json({status:"increment",total:price})
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



const cartDelete = async(req,res)=>{
    try{
     const userId = req.session.user
     const {id,quantity} = req.body
     const findCart = await Cart.findOne({user:userId,'products.productId':id})
     console.log(findCart)
     if(findCart){
        const productTodelete = findCart.products.find(product => product.productId == id)
        console.log('helooooo',productTodelete)
        const price = productTodelete.price
        const totalDecerement =  price*quantity
        const deleteItem = await Cart.updateOne(
            {user:userId},
            {
                $pull:{
                    products:{
                        productId:id,
                        quantity:quantity
                    }
                },
                $inc:{total: -totalDecerement}
            }
        )
        console.log('delete item from cart',deleteItem)
        res.json({status:"delete"})
     }

    //  console.log(findCart)
    //  let total = 0
    //  const price = findCart.offprice
    //  if(findCart){
    //     const itemDelete = await Cart.updateOne({user:userId},{
    //         $pull:{
    //             products:[{
    //                 productId:id,
    //                 quantity:quantity
    //             }]
    //         },
    //         $inc:{total-price}
            
    //     })
    //     await itemDelete.save()

    //     res.json({status:"delete"})
    //     console.log('product deleted ',itemDelete)
    //  }else{
    //     console.log("connot find the user")
    //  }

    }catch(err){
        console.log(err.message)
    }
}
module.exports = {
    userCartGet,
    addToCart,
    quantityIncrement,
    cartDelete

}