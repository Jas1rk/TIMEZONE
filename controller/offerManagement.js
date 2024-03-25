


const adminOfferGet = async(req,res)=>{
    try{
        res.render('admin/offers')
    }catch(err){
        console.log(err)
    }
}


module.exports = {
    adminOfferGet
}