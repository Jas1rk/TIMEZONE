
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



const filteringDateRange = async(req,res)=>{
    try{
        
        const {selectOption} = req.body
        const  today = new Date()
        let startDate , endDate

        switch (selectOption) {
            case 'Daily':
                startDate = new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0);
                endDate = new Date(today.getFullYear(),today.getMonth(),today.getDate(),23,59,59)
                break;
            case 'Weekly':
                const dayOfWeek = today.getDate()
                startDate = new Date(today.getFullYear(),today.getMonth(),today.getDate() - dayOfWeek, 0,0,0)
                endDate = new Date(today.getFullYear(),today.getMonth(),today.getDate() + (6-dayOfWeek),23,59,59)
                break;
            case 'Monthly':
                startDate = new Date(today.getFullYear(),today.getMonth(),1,0,0,0)
                endDate = new Date(today.getFullYear(),today.getMonth() + 1,0,23,59,59)
                break;
            case 'Yearly':
                startDate = new Date(today.getFullYear(), 0,1,0,0,0)
                endDate = new Date(today.getFullYear(),11,31,23,59,59)
                break
            default:
               throw new Error('invlid selectOption')
        }

        const filterData = await Order.find({
            status:'Delivered',
            createdate:{$gte:startDate, $lte:endDate}
        }).populate('user')
        res.json({orders:filterData})
    }catch(err){
        console.log(err.message);
    }
}


module.exports = {
    salesReportGet,
    filterSalesReportbyDate,
    filteringDateRange
}