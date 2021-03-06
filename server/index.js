const express = require('express')
//var cors = require('cors')
const app = express()
//app.use(cors())

const ip = require("ip");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require('./config/key')
const {User} = require("./models/User");
const {auth} = require("./middleware/auth")

//application/urlencorded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser())
// app.use(function(req, res, next) {
//     //res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:true
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err))


console.log( ip.address() );

app.get('/', (req, res) => 
    res.send('굿모닝 안녕하세요.!')
)

app.post('/api/user/register', (req, res) => {
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

app.post('/api/users/login', (req, res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({email: req.body.email}, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        } 

        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) {
                return res.json({loginSuccess:false, message:'비밀번호가 틀렸습니다'})
            }
            //비밀번호가 맞다면 토큰을 생성하기
            user.generateToken((err, user) => {
                if(err) res.status(400).send(err)
                // 토큰을 저장한다. 어디에 ? 쿠키, 로컬스토리지
                res.cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess:true,
                    userId: user._id
                })
                //postman에서 왜 쿠키 확인이 안될까?
                //var x_auth = req.cookies.x_auth;
                //console.log('x_auth:'+x_auth)
            });
        })
    })
    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인

    //비밀번호까지 맞다면 토큰을 생성하기
})

//role 0 일반 유저, 0이 아니면 관리자
app.get('/api/users/auth', auth, (req, res) => {
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 True란 말.
    res.status(200) .json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false: true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image

    })
})


app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token:''}, (err, user) => {
        if(err) return res.json({success: false, err})
        return res.status(200).send({
            success: true
        })
    })
})

app.get('/api/hello', (req, res) => {
    res.send('안녕하세요')
})

const port = 5000
app.listen(port, () => 
    console.log(`Example app listening at http://${ip.address()}:${port}`)
)