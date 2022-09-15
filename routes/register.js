// @ts-check
const express = require('express');

const mongoClient = require('./mongo');

const router = express.Router();

router.get('/', async (req, res) => {
  res.render('register');
});

router.post('/', async (req, res) => {
  const client = await mongoClient.connect();
  const userCursor = client.db('kdt1').collection('users');
  const duplicated = await userCursor.findOne({
    id: req.body.id,
  });

  if (duplicated === null) {
    const result = await userCursor.insertOne({
      id: req.body.id,
      password: req.body.password,
    });
    if (result.acknowledged) {
      res.send('회원 가입 성공!<br><a href="/login">로그인 페이지로 이동</a>');
    } else {
      res.status(404);
      res.send(
        '회원 가입 문제 발생.<br><a href="/register">회원가입 페이지로 이동</a>'
      );
    }
  } else {
    res.status(404);
    res.send(
      '중복된 id 가 존재합니다.<br><a href="/register">회원가입 페이지로 이동</a>'
    );
  }
});

module.exports = router;
