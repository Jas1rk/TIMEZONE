



const getWishlistPage = async(req,res)=>{
    try{
        res.render('wishlist')
    }catch(err){
        console.log(err.message)
    }
}




module.exports = {
    getWishlistPage
}