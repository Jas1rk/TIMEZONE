const mongoose = require('mongoose')
const productSchema = mongoose.Schema({
      pname: {
        type: String,
        required: true,
      },
    
      regprice: {
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
    
      images: {
        type: Array,
        required : true
      },
      
      category: {
        type: String,
        required :true
      },
    
      // brand: {
      //   type: String,
      //   required: true,
      // },
    
      color: {
        type: String,
        required: true,
      },
    
      material: {
        type: String,
        required: true,
      },
     
      stock:{
        type:Number,
        
      },
     

      isBlocked:{
        type:Boolean,
        default:false
    },
      
})

const Product = mongoose.model('Product',productSchema)

module.exports = Product




  
