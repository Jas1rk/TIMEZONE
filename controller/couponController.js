const Coupon = require('../model/couponModel')
const User = require('../model/userModel')
const Cart = require('../model/cartModel')
const generateCoupon = require('../controller/couponcodeGenarator')



const allCouponsGetPage = async(req,res)=>{
    try{
        const pages = req.query.page || 1
        const sizeOfPage = 4
        const couponSkip = (pages-1) * sizeOfPage
        const couponCount = await Coupon.countDocuments()
        const numsOfPage = await Math.ceil(couponCount / sizeOfPage )
        const coupons = await Coupon.find({}).sort({_id:-1}).skip(couponSkip).limit(sizeOfPage)
        const currentPage = parseInt(pages)
        res.render('admin/coupens',{coupons,numsOfPage,currentPage})
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
        
        const {couponName,satrtindDate,endingDate,minimumAmount,percentage} = req.body
        const existingCoupon = await Coupon.findOne({cname:couponName})
        if(existingCoupon){
        
            res.json({status:'exist'})
        }else if(minimumAmount < 800) {
            res.json({status:'minimum'})
        }else{
            const couponcode = generateCoupon()
             const newCoupon = new Coupon({
              cname:couponName,
              startdate:satrtindDate,
              enddate:endingDate,
              minimumpurchase:minimumAmount,
              ccode:couponcode,
              percentage:percentage
 
            })
 
            await newCoupon.save()
            res.json({status:'creat'})
        }
            
         
        

    }catch(err){
        console.log(err.message)
    }
}


const blockCoupon = async(req,res)=>{
    try{
        const {id} = req.body
        const block = await Coupon.findByIdAndUpdate(id,{isblocked:true})
        res.json({status:'blocked'})
    }catch(err){
        console.log(err.message)
    }
}


const unblockCoupon = async(req,res)=>{
    try{
        const {id} = req.body
        const unblock = await Coupon.findByIdAndUpdate(id,{isblocked:false})
        res.json({status:'unblock'})
    }catch(err){
        console.log(err.message)
    }
}

const deleteCoupon = async(req,res)=>{
    try{
        const {id} = req.body
        const deletecoupon = await Coupon.findByIdAndDelete(id)
        res.json({status:'deleted'})
    }catch(err){
        console.log(err.message)
    }
}


const userApplyCoupon = async (req, res) => {
    try {
    
        const { coupon , totalAmount,cartid } = req.body;
        const userID = req.session.user._id;
        const cartFInd = await Cart.findOne({_id:cartid})
        const couponFind = await Coupon.findOne({ccode:coupon,isblocked:false})
       
        if(couponFind){
        
               
            if(couponFind.user.includes(userID)){
                res.json({status:'userapplied'})   
            }else{
               
                if(cartFInd.total > couponFind.minimumpurchase){
                 
                let totalAountOfOrder = cartFInd.total
                let dicountTotal = couponFind.percentage
                let discountAmount = (totalAountOfOrder * dicountTotal) / 100
                let amountAfterDiscount = Math.ceil(totalAountOfOrder - discountAmount)
                
                res.json({status:'applied',amountAfterDiscount,dicountTotal})
              
            }else{
             
               res.json({status:'notreachpurchaseAmount'})
            }      
             
        }
             
        }else{
            res.json({status:'couponblocked'})
         
        }
       
       
    } catch (err) {
        console.log(err.message);
       
    }
};



module.exports = {
    addcouponGet,
    allCouponsGetPage,
    addCouponPost,
    blockCoupon,
    unblockCoupon,
    deleteCoupon,
    userApplyCoupon
    
}


