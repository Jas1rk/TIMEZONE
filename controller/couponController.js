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
        }else {

            const couponcode = generateCoupon()
             const newCoupon = new Coupon({
              cname:couponName,
              startdate:satrtindDate,
              enddate:endingDate,
              minimumpurchase:minimumAmount,
              ccode:couponcode,
              percentage:percentage
 
            })
 
            console.log('coupon===> CREATED',newCoupon)
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
        const { coupon , totalAmount,cid } = req.body;
        const userID = req.session.user;
        const cartFInd = await Cart.findOne({_id:cid})
        const findUser = await User.findById(userID);
        if (!findUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const findCoupon = await Coupon.findOne({ ccode: coupon });
        if (!findCoupon) {
            return res.status(404).json({ message: "Coupon not found." });
        }

        if (!findUser.appliedCoupons) {
            findUser.appliedCoupons = [];
        }
        let totalAountOfOrder = cartFInd.total
        let dicountTotal = findCoupon.percentage
        let discountAmount = (totalAountOfOrder * dicountTotal) / 100
        let amountAfterDiscount = totalAountOfOrder - discountAmount
       
        const isCouponApplied = findUser.appliedCoupons.includes(findCoupon._id);
        if (!isCouponApplied) {
            findUser.appliedCoupons.push(findCoupon._id);
            await findUser.save();
            console.log('Coupon applied successfully.');
            res.json({status:'applied',amountAfterDiscount,dicountTotal})
        } else {
            console.log('This coupon has already been applied.');
            return res.status(400).json({ message: "This coupon has already been applied." });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Internal Server Error" });
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