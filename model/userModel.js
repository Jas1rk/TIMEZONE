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
    refferelCode:{
        type:String
    },
    otherRefferel:{
        type:String
    },

    isBlocked:{
        type:Boolean,
        default:false
    },
    
},{versionKey:false})

const User =  mongoose.model('User',userSchema)

module.exports = User