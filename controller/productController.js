const Product = require('../model/productModel')
const Category = require('../model/categoryModel')
const multer = require('../controller/multer/multer')
const { render } = require('ejs')
const fs = require('fs')
const { log } = require('console')
const { NONAME } = require('dns')




const adminProductsGet = async (req, res) => {
    try {
        const catagData = await Category.find({})
        const productData = await Product.find({})
        res.render('admin/adminproducts', { catagData, productData })

    } catch (err) {
        console.log(err)
    }
}


const addProductGet = async (req, res) => {
    try {
        const categories = await Category.find({ isBlocked: false })
        res.render('admin/addproduct', { categories })

    } catch (err) {
        console.log(err);
    }
}

const addProductPost = async (req, res) => {
    try {

        const { pname, description, regularprice, offerprice, color, meterial, category ,stock} = req.body
        const images = req.files
        const catData = await Category.findOne({name:category})
        const imageFile = images.map(elements => elements.filename)

        const newProduct = new Product({
            pname,
            description,
            regprice: regularprice,
            offprice: offerprice,
            color,
            material: meterial,
            category:catData._id,
            images: imageFile,
            stock:stock
        })
        await newProduct.save()
        console.log(newProduct)
        res.redirect('/admin/productadmin')


    } catch (err) {
        console.log(err.message)
    }
}



const adminProductEdit = async (req, res) => {
    try {
        const productId = req.query._id
        req.session.productId = productId
        const productData = await Product.findOne({ _id: productId });
        const categoryData = await Category.find({ isBlocked: false })
        res.render('admin/admineditproduct', { productData, categoryData })

    } catch (err) {
        console.log(err.message)
    }
}


const adminEditProductPost = async (req, res) => {
    try {

        const productId = req.session.productId
        const { pname, description, regularprice, offerprice, color, meterial, category , stock} = req.body
        const images = req.files
        const catData = await Category.findOne({name:category})
        console.log('helooooo',catData);
        const newImages = images.map(elements => elements.filename)
        console.log(newImages);
        if (images.length > 0) {
            await Product.findByIdAndUpdate({ _id: productId }, { $push: { images: { $each: newImages } } })
        }
        const updateProduct = await Product.findByIdAndUpdate({ _id: productId }, {
            $set: {
                pname: pname,
                description: description,
                regprice: regularprice,
                offprice: offerprice,
                color: color,
                material: meterial,
                category: catData._id,
                stock:stock

            }
        })
        console.log(updateProduct)
        res.redirect('/admin/productadmin')


    } catch (err) {
        console.log(err.message)
    }
}


const adminProductBloack = async (req, res) => {
    try {
        const productData = req.query._id
        const data = await Product.findByIdAndUpdate(productData, { isBlocked: true })
        console.log('product blocked', data)
        res.redirect('/admin/productadmin')

    } catch (err) {
        console.log(err.message)
    }
}


const adminUnblockproduct = async (req, res) => {
    try {
        const productData = req.query._id
        const data = await Product.findByIdAndUpdate(productData,{isBlocked:false})
        console.log('productunblocked', data)
        res.redirect('/admin/productadmin')
    } catch (err) {
        console.log(err.message)
    }
}

const deleteImage = async (req, res) => {
    try {
        const productData = req.body.id
        const index = req.body.index
        console.log(index);
       const prod = await Product.findById(productData)
       const imageToDelete = prod.images[index]
       console.log(imageToDelete);
        fs.unlink(imageToDelete,(err)=>{
            if(err){
                console.error(err)
            }else{
                console.log("done");
            }
        })
        prod.images.splice(index,1)
        await prod.save();
     
        res.json({status:'success'})
       
    } catch (err) {
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
    deleteImage,
   


}