const Coupon = require('../model/couponModel')
const generateCoupon = require('../controller/couponcodeGenarator')



const allCouponsGetPage = async(req,res)=>{
    try{
        const coupons = await Coupon.find({})
        res.render('admin/coupens',{coupons})
    }catch(err){
        console.log(err.message)
    }
}


const addcouponGet = async(req,res)=>{
    try{
        res.render('admin/addcoupon')
    }catch(err){
        console.log(err.message)
    }
}

const addCouponPost = async(req,res)=>{
    try{
        
        const {couponName,satrtindDate,endingDate,minimumAmount} = req.body
        const existingCoupon = await Coupon.findOne({cname:couponName})
        if(existingCoupon){
            res.json({status:'exist'})
        }else{
            const cid = generateCoupon()
           const newCoupon = new Coupon({
             cname:couponName,
             startdate:satrtindDate,
             enddate:endingDate,
             minimumpurchase:minimumAmount,
             ccode:cid

           })
           console.log('coupon===>',newCoupon)
           await newCoupon.save()
           res.json({status:'creat'})
        }

    }catch(err){
        console.log(err.message)
    }
}




module.exports = {
    addcouponGet,
    allCouponsGetPage,
    addCouponPost,
    
}