const mongoose = require('mongoose')
const productSchema = mongoose.Schema({
    pname: {
        type: String,
        required: true,
      },
    
      price: {
        type: Number,
        required: true,
      },
      offprice: {
        type: Number,
        required: true,
      },
    
      description: {
        type: String,
        required: true,
      },
    
      images: [
        {
          type: String,
        },
      ],
      
      category: {
        type: String,
        required: true,
      },
    
      brand: {
        type: String,
        required: true,
      },
    
      color: {
        type: String,
        required: true,
      },
    
      material: {
        type: String,
        required: true,
      },
    
      caseSize: {
        type: String,
        required: true,
      },

      isBlocked:{
        type:Boolean,
        default:false
    },
      
})

const Product = mongoose.model('Product',productSchema)

module.exports = Product




  
