const Category = require('../model/categoryModel')


const admincategory = async(req,res)=>{
    try{
        const categories = await Category.find({})
        res.render('admin/categoryadmin',{categories})
    }catch(err){
        console.log(err.message)
    }
}


const admincategoryPost = async(req,res)=>{
    try{
        const {name,description} = req.body
        console.log(req.body)
        const newCategory = await new Category({
            name:name,
            description:description
        })
        await newCategory.save()
        console.log(newCategory)
        res.redirect('/admin/admincategory')

    }catch(err){
        console.log(err.message)
    }
}





module.exports = {
    admincategory,
    admincategoryPost,


}



