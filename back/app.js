'use strict'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000

const cliente_route = require('./routes/cliente')
const admin_route = require('./routes/admin')
const producto_route = require('./routes/producto')
const cupon_route = require('./routes/cupones')

mongoose.connect('mongodb://localhost:27017/tienda', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}) 
    .then( () => {
        app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    })
    .catch((err)=>{
        console.error(err)
    })

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({extended: true}))

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api', cliente_route)
app.use('/api', admin_route)
app.use('/api', producto_route)
app.use('/api', cupon_route)

module.exports = app