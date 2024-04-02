const mongoose = require('mongoose')
const offerSchema  = new mongoose.Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
   
    startingDate:{
        type:String
    },
    endingDate:{
        type:String
        
    },
    percentage:{
       type:Number 
    }
  

},{versionKey:false})

const Offer = mongoose.model('Offer',offerSchema)

module.exports = Offer