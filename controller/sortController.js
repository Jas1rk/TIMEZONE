const Product = require('../model/productModel')
const Category = require('../model/categoryModel')

const sortItems = async(req,res)=>{
    try{
        const shop = req.query.shop
         if(shop == "pricetolow"){
            const data = await Product.find({isBlocked:false}).sort({offprice:1})
            const products = await Product.find({isBlocked:false}).sort({_id:-1}).limit(3)
            res.render('productsright',{data,products})

         }else if(shop == "pricetohigh"){

                const data = await Product.find({isBlocked:false}).sort({offprice:-1})
                const products = await Product.find({isBlocked:false}).sort({_id:-1}).limit(3)
                res.render('productsright',{data,products}) 

         }else if(shop =="atoz"){

            const data = await Product.find({isBlocked:false}).sort({pname:1})
            const products = await Product.find({isBlocked:false}).sort({_id:-1}).limit(3)
            res.render('productsright',{data,products}) 

         }else if(shop == "ztoa"){

            const data = await Product.find({isBlocked:false}).sort({pname:-1})
            const products = await Product.find({isBlocked:false}).sort({_id:-1}).limit(3)
            res.render('productsright',{data,products})  
         }
    }catch(err){
        console.log(err.message)
    }
}



const filterCategory = async(req,res)=>{
    try{ 
        const catData = req.query._id
        const findCat = await Category.findById({_id:catData})
        const data = await Product.find({category:findCat._id})
        const products = await Product.find({isBlocked:false}).sort({_id:-1})
        console.log(data)
        res.render('productsright',{data,products})
        
    }catch(err){
        console.log(err.message)
    }
}

 const searchProducts = async(req,res)=>{
    try{
        const {searchDataValue} = req.body
        const searchProducts = await Product.find({pname:{
            $regex: searchDataValue , $options: 'i'
        }})
        console.log(searchProducts)
        res.json({status:"searched",searchProducts})

    }catch(err){
        console.log(err);
    }
 }

// const adminFilterCategory = async(req,res)=>{
//     try{
//        const catData =  req.query._id
//        console.log(catData);
//     }catch(err){
//         console.log(err.message)
//     }
// }

module.exports = {
    sortItems,
    filterCategory,
    searchProducts
    // adminFilterCategory
}