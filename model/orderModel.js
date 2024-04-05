const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    address:{
       type : Object,
       required:true

    },

    products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            
        },
        quantity:{
            type:Number
        },
        total:{
            type:Number
        },
        productStatus:{
            type:Boolean,
            default:false
          },
          price:{
            type:Number
          }

    }],
    totalamount:{
        type:Number
    },
    paymentmethod:{
        type:String
    },
    status:{
        type:String
    },
    createdate:{
        type:Date,
        default:Date.now()
    },
    orderid:{
        type:Number,
        required:true
    }
})

const Order = mongoose.model('Order',orderSchema)

module.exports = Order