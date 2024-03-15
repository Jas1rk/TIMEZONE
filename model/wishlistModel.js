const mongoose = require('mongoose')
const wishlistSchema =  new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    products:[{
        productId:{
            type:mongoose.Schema.ObjectId,
            ref:'Product'
        }
    }]
},)