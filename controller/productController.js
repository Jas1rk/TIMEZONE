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
        
        const {pname,description,regularprice,offerprice,color,meterial,category} = req.body
        const images = req.files
        console.log(images);
        const imageFile = images.map(elements=> elements.filename)
       
        const newProduct = new Product({
            pname,
            description,
            regprice:regularprice,
            offprice:offerprice,
            color,
            material:meterial,
            category,
            images:imageFile
        })
        await newProduct.save()
        console.log(newProduct)
        res.redirect('/admin/productadmin')


    }catch(err){
        console.log(err.message)
    }
}



const adminProductEdit = async(req,res)=>{
    try{
        const productId = req.query._id
        // console.log(productId);
        req.session.productId = productId
        const productData = await Product.findOne({_id:productId});
        const categoryData = await Category.find({isBlocked:false})
        res.render('admin/admineditproduct',{productData,categoryData})

    }catch(err){
        console.log(err.message)
    }
}


const adminEditProductPost = async(req,res)=>{
    try{
      
        const productId = req.session.productId
       const {pname,description,regularprice,offerprice,color,meterial,category} = req.body
       console.log(req.body)
       const images = req.files
       const newImages = images.map(elements => elements.filename)
       console.log(newImages);
       if(images.length > 0){
          await Product.findByIdAndUpdate({_id:productId},{$push:{images:{$each:newImages}}})
       }
        const updateProduct = await Product.findByIdAndUpdate({_id:productId},{$set:{
            pname:pname,
            description:description,
            regprice:regularprice,
            offprice:offerprice,
            color:color,
            material:meterial,
            category:category

        }})
        console.log(updateProduct)
        res.redirect('/admin/productadmin')
        

    }catch(err){
        console.log(err.message)
    }
}


const adminProductBloack = async(req,res)=>{
    try{
        const productData = req.query._id
        console.log('product blocked',productData)
        const data = await Product.findByIdAndUpdate(productData,{isBlocked:true})
        res.redirect('/admin/productadmin')

    }catch(err){
        console.log(err.message)
    }
}


const adminUnblockproduct = async(req,res)=>{
    try{
       const productId = req.query._id
       console.log('haiii',productId)
    }catch(err){
        console.log(err.message)
    }
}

const deleteImage= async(req,res)=>{
    try{
        
        const productData = req.query._id
        const imageDelete = req.body
        if(!productData){
            res.status(404).send('invalid id ')
            return
        }

        if(imageDelete){
            await Product.findByIdAndUpdate({_id:productData},{$pull:{images:imageDelete}})
            res.redirect('/admin/productedit')
            console.log(imageDelete)
        }else{
            res.status(404).send('error in delete')
            console.log("error in delete section")
        }

    }catch(err){
        console.log(err.message)
    }
}

module.exports = {
    adminProductsGet,
    addProductGet,
    addProductPost,
    adminProductEdit,
    adminEditProductPost,
    adminProductBloack,
    adminUnblockproduct,
    deleteImage


}