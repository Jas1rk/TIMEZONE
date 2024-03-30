const mongoose = require('mongoose')
const offerSchema  = new mongoose.Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    startingDate:{
        type:String
    },
    endingDate:{
        type:String
        
    },
    percentage:{
       type:number 
    }


},{versionKey:false})

const Offer = mongoose.model('Offer',offerSchema)

module.exports = Offer