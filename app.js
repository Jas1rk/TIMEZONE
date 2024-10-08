const express = require('express')
const app = express()
const session =  require('express-session')
const userRoute = require('./route/userRoute')
const adminRoute = require('./route/adminRoute')
const mongoose = require('mongoose')
const nocache = require('nocache')
const mongodb = require('./config/db')

mongodb()

app.set('view engine','ejs')



app.use(session({
    secret : "Timezone@1234",
    resave: false,
    saveUninitialized: true

}))
app.use(express.static('views'))
app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(express.urlencoded({extended:true}))
app.use(nocache())


app.use('/',userRoute)
app.use('/admin',adminRoute)

app.use('/*',(req,res,next)=>{
    res.render('error404')
})


const PORT = 3008

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})







