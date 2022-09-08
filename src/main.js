// @ts-check

const e = require('express');
const express = require('express');

const app = express();
const userRouter = express.Router();
const PORT = 4000;

const USER = {
  1: {
    id: 'tetz',
    name: '이효석',
  },
};

userRouter.get('/', (req, res) => {
  res.send(USER);
});

userRouter.get('/:id', (req, res) => {
  const userData = USER[req.params.id];
  if (userData) {
    res.send(userData);
  } else {
    res.end('ID not found');
  }
});

userRouter.post('/', (req, res) => {
  if (req.query.id && req.query.name) {
    const newUser = {
      id: req.query.id,
      name: req.query.name,
    };

    USER[Object.keys(USER).length + 1] = newUser;

    res.send('회원 등록 완료');
  } else {
    res.end('Unexpected query');
  }
});

userRouter.put('/:id', (req, res) => {
  const userData = USER[req.params.id];
  if (userData) {
    res.send(userData);
  } else {
    res.end('ID not found');
  }
});

userRouter.delete('/:id', (req, res) => {
  const userData = USER[req.params.id];
  if (userData) {
    delete USER[req.params.id];
    res.send('회원 삭제 완료');
  } else {
    res.end('ID not found');
  }
});

app.use('/users', userRouter);

app.use('/', (req, res) => {
  res.send('Hello, express world!');
});

app.listen(PORT, () => {
  console.log(`The express server is running at port: ${PORT}`);
});
