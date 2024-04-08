const Admin = require('../model/adminModel')
const Order = require('../model/orderModel')
const Product = require('../model/productModel')
const Category  = require('../model/categoryModel')
const User = require('../model/userModel')
const chart = require('chart.js')


    const  adminDashGet = async(req,res)=>{
        try{
            const [orders,totalOrders,totalProduct,totalCategory , totalUsers] = await Promise.all([
                Order.find({status:'Delivered'}).populate('products.productId'),
                Order.find({}).count(),
                Product.find({}).count(),
                Category.find({}).count(),
                User.find({}).count()

            ])
           
           
            let profit = 0
            orders.forEach(order => {
                profit +=order.totalamount
            })
          
            const bestSellingProducts = await Order.aggregate([
                {$match:{status:'Delivered'}},
                {$unwind:'$products'},
                {$group:{_id:'$products.productId', totalQauntity:{$sum:'$products.quantity'}}},
                {$sort:{totalQauntity:-1}},
                {$limit:10},
                {
                    $lookup:{
                        from:'products',
                        localField:'_id',
                        foreignField:'_id',
                        as:'productInfo'
                    }
                },
                {$unwind:'$productInfo'},
                {$project:{
                    name:'$productInfo.pname',
                    images:'$productInfo.images',
                    totalQauntity:1
                }}

            ])
         
            
            const topCategories = await Order.aggregate([
                {$match:{status:'Delivered'}},
                {$unwind:'$products'},
                {
                    $lookup: {
                        from: 'products',
                        localField: 'products.productId',
                        foreignField: '_id',
                        as: 'productInfo'
                    }
                },
                {$unwind:'$productInfo'},
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'productInfo.category',
                        foreignField: '_id',
                        as: 'categoryInfo'
                    }
                },
                { $unwind: '$categoryInfo' },
                { $group: { _id: '$categoryInfo._id', totalQuantity: { $sum: '$products.quantity' } } },
                { $sort: { totalQuantity: -1 } },
                { $limit: 10 },
                { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
                { $unwind: '$category' },
                { $project: { name: '$category.name', totalQuantity: 1 } }
            ])

           

            res.render('admin/adminhome',{
                totalOrders,
                profit,
                totalProduct,
                totalCategory,
                bestSellingProducts,
                topCategories,
                totalUsers
            })
        }catch(error){
            console.log(error)
        }
    }


    const displayMonthlyData = async (req, res) => {
        try {
            const monthlySales = Array.from({ length: 12 }, () => 0);
            const orders = await Order.find({ status: "Delivered" });
    
            for (const order of orders) {
                if (order.createdate instanceof Date) {
                    const month = order.createdate.getMonth();
                    monthlySales[month] += order.totalamount;
                } else {
                    console.warn(`Invalid createdAt date for order ${order._id}`);
                }
            }
    
            res.json({ monthlySales });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    

    const displayYearlyData = async (req, res) => {
        try {
            const START_YEAR = 2022;
            const currentYear = new Date().getFullYear();
            const yearlySales = Array.from({ length: currentYear - START_YEAR + 1 }, () => 0);
    
            const orders = await Order.find({ status: "Delivered" });
    
            for (const order of orders) {
               
                if (order.createdate instanceof Date) {
                    const year = order.createdate.getFullYear();
                    yearlySales[year - START_YEAR] += order.totalamount;
                } else {
                    console.warn(`Invalid createdAt date for order ${order._id}`);
                }
            }
    
            res.json({ yearlySales, START_YEAR });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    


const adiminlogGet = (req,res)=>{
    try{
      res.render('admin/adminlog')
    }catch(err){
        console.log('cannot render admin page ')
    }
}



const adminlogPost = async(req,res)=>{
   
    try{
      const email = req.body.email
      const password = req.body.password
      const findAdmin = await Admin.findOne({email:email})
      console.log(findAdmin)
      if(findAdmin){
        if(findAdmin.password === password){
                req.session.admin = email
                res.redirect('/admin/admindash')

           
        }else{
            res.render('admin/adminlog',{message:"Invalid password"})
            res.redirect('/admin')
        }
    }else{
        res.render('admin/adminlog',{message:"Cannot find admin"})
        console.log('conneot find admin')
    }

    }catch(error){
        console.log(error)
    }
}



const logoutAdmin = async(req,res)=>{
   
    try{
        req.session.destroy((err)=>{
            if(err){
                console.log("error in logout",err)
            }else{
                res.redirect('/admin')

            }
        })

    }catch(error){
        console.log(error.message)
    }
}


module.exports = {
    adiminlogGet,
    adminlogPost,
    adminDashGet,
    logoutAdmin,
    displayMonthlyData,
    displayYearlyData

}





