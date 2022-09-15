// @ts-check
const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/', async (req, res) => {
  res.render('login');
});

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) next(err);
    console.log(info);
    if (!user) {
      return res.send(
        `${info.message}<br><a href="/login">로그인 페이지로 이동</a>`
      );
    }
    req.logIn(user, (err) => {
      if (err) next(err);
      res.redirect('/board');
    });
  })(req, res, next);
});

module.exports = router;
