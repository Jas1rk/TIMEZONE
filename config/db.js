mongoose = require('mongoose')
const  dotenv = require('dotenv')
dotenv.config()

 const mongodb =  () => {
    
    mongoose.connect(process.env.mongoose)

mongoose.connection.on('connected',()=>{
    console.log('mongodb Connected');
})

mongoose.connection.on('disconnected',()=>{
    console.log('mongodb disConnected');
})

mongoose.connection.on('error',()=>{
    console.log('mongodb error');
})
 


}

module.exports = mongodb
