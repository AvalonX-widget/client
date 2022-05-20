const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT || 8080;
const {sequelize} = require('../src/app/mysql/model');

const session = require('express-session');

const userRouter = require('../src/app/mysql/routes/user.js');
const postRouter = require('../src/app/mysql/routes/post.js');
const likeRouter = require('../src/app/mysql/routes/like.js');

sequelize.sync();

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));

app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/likes', likeRouter);

app.listen(PORT,  () =>{
  console.log('Example app listening on port  8080!');
});
