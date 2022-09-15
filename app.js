// @ts-check
const express = require('express');

// Nodejs 모듈
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// 개별 모듈
const localStrategy = require('./routes/localStrategy');

const app = express();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', 'views');

// 스태틱 폴더 설정
app.use(express.static('public'));
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
localStrategy();
// Cookie-parser
app.use(cookieParser('tetz'));

const router = require('./routes/index');
const boardRouter = require('./routes/board');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');

app.use('/', router);
app.use('/board', boardRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode || 500);
  res.send(err.message);
});

app.listen(PORT, () => {
  console.log(`The express server is running at port: ${PORT}`);
});
