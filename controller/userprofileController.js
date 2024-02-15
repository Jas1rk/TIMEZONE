
const userProfile = async(req,res)=>{
    try{
        if(req.session.user){
            res.render('userprofile')
        }else{
            
            res.redirect('/login')
        }
       

    }catch(err){
        console.log(err.message)
    }
}




module.exports = {
    userProfile
}