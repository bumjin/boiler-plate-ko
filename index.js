const express = require('express')
const app = express()
const port = 5000
var ip = require("ip");
console.log( ip.address() );

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://bumjin:handy21@boilerplate-gfnfu.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:true
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => res.send('안녕하세요.!'))
app.listen(port, () => 
    console.log(`Example app listening at http://${ip.address()}:${port}`)
)