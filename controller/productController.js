const Product = require('../model/productModel')



const addProduct = (req,res)=>{
    try{
        res.render('admin/addproduct')

    }catch(err){
        console.log(err);
    }
}





module.exports = {
    addProduct
}