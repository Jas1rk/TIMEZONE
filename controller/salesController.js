
const Order = require('../model/orderModel')



const salesReportGet = async(req,res)=>{
    try{
        const orderData = await Order.find({status:"Delivered"}).populate('user').sort({_id:-1})
        res.render('admin/salesreport',{orderData})
    }catch(err){
        console.log(err.message)
    }
}

const filterSalesReportbyDate = async(req,res)=>{
  try{
    const {startDate,endDate} = req.body
    const startingDate = new Date(startDate)
    const endingDate = new Date(endDate)

     const filterData = await Order.find({
        status:"Delivered",
        createdate:{$gte: startingDate , $lte: endingDate}
     }).populate('user')
     console.log(filterData)
     res.json({orders:filterData})

  }catch(err){
    console.log(err.message)
  }
}



module.exports = {
    salesReportGet,
    filterSalesReportbyDate
}