// @ts-check
const express = require('express');

// Nodejs 모듈
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// 개별 모듈
const passportStrategy = require('./routes/passport');

const app = express();
const PORT = 4000;

app.set('view engine', 'ejs');
app.set('views', 'views');

// 스태틱 폴더 설정
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
// Body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Session
app.use(
  session({
    secret: 'tetz',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);
// Passport
app.use(passport.initialize());
app.use(passport.session());
passportStrategy();
// Cookie-parser
// Cookie-parser
app.use(cookieParser('tetz'));

const router = require('./routes/index');
const boardRouter = require('./routes/board');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const chatRouter = require('./routes/chat');

app.use('/', router);
app.use('/board', boardRouter);
app.use('/register', registerRouter.router);
app.use('/login', loginRouter.router);
app.use('/chat', chatRouter);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode || 500);
  res.send(err.message);
});

app.listen(PORT, () => {
  console.log(`The express server is running at port: ${PORT}`);
});
