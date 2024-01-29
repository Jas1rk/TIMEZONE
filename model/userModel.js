const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:2,
        maxlength:50
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    mobile: {
        type:Number,
        required:true,
    
    },
    password:{
        type:String,
        required:true
    },
    isBlocked:{
        type:Boolean,
        required:true,
        default:false
    },
    isAdmin:{
        type:Number,
        default:0,
        required:true

    }
    
},{versionKey:false})

const User =  mongoose.model('User',userSchema)

module.exports = User