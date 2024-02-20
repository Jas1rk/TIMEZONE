const mongoose = require('mongoose')
const addressSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    uname:{
        type:String
    },
    umobile:{
        type:Number
    },
    uaddress:{
        type:String
    },
    upin :{
        type:Number
    },
    ulocation:{
        type:String
    },
    ucity:{
        type:String
    },
    ustate:{
        type:String
    },
    ucountry:{
        type:String

    },
    uaddresstype:{
        type:String
    }
})

const Address = mongoose.model('Address',addressSchema)
module.exports = Address