const Product = require('../model/productModel')
const Category = require('../model/categoryModel')
const multer = require('../controller/multer/multer')



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
        const categories = await Category.find({isBlocked:false})
        res.render('admin/addproduct',{ categories })

    }catch(err){
        console.log(err);
    }
}

const addProductPost = async (req,res)=>{
    try{
        const {pname,regprice,offprice,description,category,color,material} = req.body
        console.log(req.body)
        const images = req.files.map(file => file.originalname);
        console.log(req.files)
        const newProduct = new Product({
            pname,
            regprice,
            offprice,
            description,
            category,
            color,
            material,
            images
        })
        await newProduct.save()
        console.log(newProduct)
        res.redirect('/admin/productadmin')


    }catch(err){
        console.log(err.message)
    }
}








module.exports = {
    adminProductsGet,
    addProductGet,
    addProductPost
}