const Product = require('../model/productModel')
const Category = require('../model/categoryModel')


const adminProductsGet = async(req,res)=>{
    try{
        const catagData = await Category.find({})
        const productData = await Product.find({})
        res.render('admin/adminproducts',{catagData, productData})

    }catch(err){
        console.log(err)
    }
}


const addProductGet = async(req,res)=>{
    try{
        const catagData = await Category.find({isBlocked:false})
        res.render('admin/addproduct',{ catagData })

    }catch(err){
        console.log(err);
    }
}

const addProductPost = async (req,res)=>{
    try{
        const {pname,regprice,offprice,description,category,color,material} = req.body
        const images = req.files.map(file => file.orginalname)

    }catch(err){
        console.log(err.message)
    }
}








module.exports = {
    adminProductsGet,
    addProductGet,
    addProductPost
}