const Product = require('../model/productModel')
const Category = require('../model/categoryModel')
const Order = require('../model/orderModel')

const sortItems = async(req,res)=>{
    try{
        const catData = req.query._id
        const shop = req.query.shop
         if(shop == "pricetolow"){
            const getCategoryData = await Category.find({isBlocked:false})
            const data = await Product.find({isBlocked:false}).sort({offprice:1})
            const products = await Product.find({isBlocked:false}).sort({_id:-1}).limit(3)
            res.render('productsright',{data,products,catData,getCategoryData})

         }else if(shop == "pricetohigh"){
                const getCategoryData = await Category.find({isBlocked:false})
                const data = await Product.find({isBlocked:false}).sort({offprice:-1})
                const products = await Product.find({isBlocked:false}).sort({_id:-1}).limit(3)
                res.render('productsright',{data,products,catData,getCategoryData}) 

         }else if(shop =="atoz"){
            const getCategoryData = await Category.find({isBlocked:false})
            const data = await Product.find({isBlocked:false}).sort({pname:1})
            const products = await Product.find({isBlocked:false}).sort({_id:-1}).limit(3)
            res.render('productsright',{data,products,catData,getCategoryData}) 

         }else if(shop == "ztoa"){
            const getCategoryData = await Category.find({isBlocked:false})
            const data = await Product.find({isBlocked:false}).sort({pname:-1})
            const products = await Product.find({isBlocked:false}).sort({_id:-1}).limit(3)
            res.render('productsright',{data,products,catData,getCategoryData})  
         }
    }catch(err){
        console.log(err.message)
    }
}



const filterCategory = async(req,res)=>{
    try{ 
        const catData = req.query._id
        const filter = req.query.filter
        const findCat = await Category.findById({_id:catData})
        const getCategoryData = await Category.find({isBlocked:false})
        let data= []
        if(catData &&  filter){
            if(filter === "pricelowtohighProducts"){

                 data = await Product.find({category:findCat._id,isBlocked:false}).sort({offprice:1})

            }else if(filter === "pricehightolowProducts"){
                  data = await Product.find({category:findCat._id,isBlocked:false}).sort({offprice:-1})
            }else if(filter === "nameascendindProducts"){
                data = await Product.find({category:findCat._id,isBlocked:false}).sort({pname:-1})
            }else if(filter === "namedescendingProducts"){
                data = await Product.find({category:findCat._id,isBlocked:false}).sort({pname:1})
            }
        }else {

            data = await Product.find({category:findCat._id,isBlocked:false})
 
        }
       
        const products = await Product.find({isBlocked:false}).sort({_id:-1}).limit(3)
        res.render('productsright',{data,products,catData,getCategoryData})
        
    }catch(err){
        console.log(err.message)
    }
}


// const filterProducts = async(req,res)=>{
//     try{

//         const filter =  req.query.filter
        
//         console.log(filter)

//     }catch(err){
//         console.log(err.message)
//     }
// }

 const searchProducts = async(req,res)=>{
    try{
        const {searchDataValue} = req.body
        const searchProducts = await Product.find({pname:{
            $regex: searchDataValue , $options: 'i'
        }})
        res.json({status:"searched",searchProducts})

    }catch(err){
        console.log(err);
    }
 }


 const searchOrder = async(req,res)=>{
    try{
       
        const {searchDataValue} = req.body
        console.log(searchDataValue)
        const searchOrders = await Order.find({createdate:searchDataValue})
        console.log(searchOrders)
        res.json({status:'searched',searchOrders})
    }catch(err){
        console.log(err.message)
    }
 }

module.exports = {
    sortItems,
    filterCategory,
    searchProducts,
    searchOrder
    // filterProducts
    
}