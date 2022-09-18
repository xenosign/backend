// @ts-check
const express = require('express');
const passport = require('passport');

const router = express.Router();

const isLogin = (req, res, next) => {
  if (req.session.login || req.user || req.signedCookies.user) {
    next();
  } else {
    res.send(
      '로그인 해주세요.<br><a href="/login">로그인 페이지로 이동</a><br><a href="/">메인 페이지로 이동</a>'
    );
  }
};

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
      res.cookie('user', req.body.id, {
        expires: new Date(Date.now() + 1000 * 60),
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
    return res.redirect('/');
  });
});

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: 'email' })
);

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/board',
    failureRedirect: '/',
  })
);

router.get('/auth/naver', passport.authenticate('naver'));

router.get(
  '/auth/naver/callback',
  passport.authenticate('naver', {
    successRedirect: '/board',
    failureRedirect: '/',
  })
);

module.exports = { router, isLogin };
