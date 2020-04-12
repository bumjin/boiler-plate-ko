const express = require('express')
const app = express()
const port = 5000
const ip = require("ip");
const bodyParser = require("body-parser");
const {User} = require("./models/User");

//application/urlencorded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());


const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://bumjin:handy21@boilerplate-gfnfu.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:true
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err))


console.log( ip.address() );

app.get('/', (req, res) => res.send('안녕하세요.!'))

app.post('/register', (req, res) => {
        //회원 가입할 때 필요한 정보들을 client에서 가져오면
        //그것들을 데이타베이스에 넣어준다.
        const user = new User(req.body)

        user.save((err, userInfo) => {
            if(err) return res.json({
                success: false, err
            })
            return res.status(200).json({
                success: true
            })
        })
    }
)



app.listen(port, () => 
    console.log(`Example app listening at http://${ip.address()}:${port}`)
)