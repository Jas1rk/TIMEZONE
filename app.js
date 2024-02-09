const express = require('express')
const app = express()
const session =  require('express-session')
const userRoute = require('./route/userRoute')
const adminRoute = require('./route/adminRoute')
const mongoose = require('mongoose')
const nocache = require('nocache')




mongoose.connect("mongodb://localhost:27017/TimeZone")

mongoose.connection.on('connected',()=>{
    console.log('mongodb Connected');
})


mongoose.connection.on('disconnected',()=>{
    console.log('mongodb disConnected');
})


mongoose.connection.on('error',()=>{
    console.log('mongodb error');
})



app.set('view engine','ejs')



app.use(session({
    secret : "Timezone@1234",
    resave: false,
    saveUninitialized: true

}))
app.use(express.static('views'))
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(nocache())


app.use('/',userRoute)
app.use('/admin',adminRoute)



const PORT = 3008
app.listen(PORT,()=>{
    console.log('server is running')
})







