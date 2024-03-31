
const Product = require('../model/productModel')
const Category = require('../model/categoryModel')
const Offer = require('../model/offerModel')


const adminOfferGet = async(req,res)=>{
    try{
      
        const categories = await Category.find({ isBlocked:false})
        res.render('admin/offers',{categories})
    }catch(err){
        console.log(err)
    }
}


const adminCreateOffer = async(req,res)=>{
    try{


    }catch(err){
        console.log(err.message)
    }
}

module.exports = {
    adminOfferGet,
    adminCreateOffer
}