// @ts-check
const express = require('express');

const crypto = require('crypto');

const mongoClient = require('./mongo');

const router = express.Router();

const createHashedPassword = (password) => {
  const salt = crypto.randomBytes(64).toString('base64');
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 10, 64, 'sha512')
    .toString('base64');
  return { hashedPassword, salt };
  // 해싱할 값, salt, 해시 함수 반복 횟수, 해시 값 길이, 해시 알고리즘
};

const verifyPassword = (password, salt, userPassword) => {
  const hashed = crypto
    .pbkdf2Sync(password, salt, 10, 64, 'sha512')
    .toString('base64');

  if (hashed === userPassword) return true;
  return false;
};

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
    const passwordData = createHashedPassword(req.body.password);

    const result = await userCursor.insertOne({
      id: req.body.id,
      password: passwordData.hashedPassword,
      salt: passwordData.salt,
      name: req.body.id,
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

module.exports = { router, verifyPassword };
