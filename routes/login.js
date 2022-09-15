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
    if (!user) {
      return res.send(
        `${info.message}<br><a href="/login">로그인 페이지로 이동</a>`
      );
    }
    req.logIn(user, (err) => {
      if (err) next(err);

      const expireDate = new Date(Date.now() + 1000 * 60 * 60 * 24);

      res.cookie('user', req.body.id, {
        expires: expireDate,
        httpOnly: true,
        signed: true,
      });
      res.redirect('/board');
    });
  })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie('user');
    return res.redirect('/');
  });
});

module.exports = router;
