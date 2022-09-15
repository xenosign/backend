// @ts-check
const express = require('express');

const mongoClient = require('./mongo');

const router = express.Router();

router.get('/', async (req, res) => {
  res.render('login');
});

router.post('/', async (req, res) => {
  const client = await mongoClient.connect();
  const userCursor = client.db('kdt1').collection('users');
  const idResult = await userCursor.findOne({
    id: req.body.id,
  });

  if (idResult !== null) {
    const result = await userCursor.findOne({
      id: req.body.id,
      password: req.body.password,
    });
    if (result !== null) {
      req.session.login = true;
      req.session.userId = req.body.id;
      req.session.password = req.body.password;
      res.redirect('/board');
    } else {
      res.status(404);
      res.send(
        '비밀번호가 틀렸습니다.<br><a href="/login">로그인 페이지로 이동</a>'
      );
    }
  } else {
    res.status(404);
    res.send(
      '해당 id 가 없습니다.<br><a href="/login">로그인 페이지로 이동</a>'
    );
  }
});

router.get('/logout', async (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

module.exports = router;
