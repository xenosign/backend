// @ts-check
const express = require('express');

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const router = require('./routes/index');
const userRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const boardRouter = require('./routes/board');

app.use('/', router);
app.use('/users', userRouter);
app.use('/posts', postsRouter);
app.use('/board', boardRouter);

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode || 500);
  res.send(err.message);
});

app.listen(PORT, () => {
  console.log(`The express server is running at port: ${PORT}`);
});
