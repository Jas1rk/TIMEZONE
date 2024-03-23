


const userWalletGet = async(req,res)=>{
    try{
        res.render('userwallet')

    }catch(err){
        console.log(err.message)
    }
}


module.exports = {
    userWalletGet
}