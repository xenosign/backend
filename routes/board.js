// @ts-check
const express = require('express');

const mongoClient = require('./mongo');

const router = express.Router();

router.get('/', async (req, res) => {
  if (req.session.login || req.signedCookies.user) {
    const client = await mongoClient.connect();
    const cursor = client.db('kdt1').collection('board');
    const ARTICLE = await cursor.find({}).toArray();

    const articleLen = ARTICLE.length;
    res.render('board', {
      ARTICLE,
      articleCounts: articleLen,
      userId: req.session.userId ? req.session.userId : req.signedCookies.user,
    });
  } else if (req.user) {
    const client = await mongoClient.connect();
    const cursor = client.db('kdt1').collection('board');
    const ARTICLE = await cursor.find({}).toArray();

    const articleLen = ARTICLE.length;
    res.render('board', {
      ARTICLE,
      articleCounts: articleLen,
      userId: req.user.id,
    });
  } else {
    res.status(404);
    res.send('로그인 해주세요.<br><a href="/login">로그인 페이지로 이동</a>');
  }
});

router.post('/', async (req, res) => {
  if (req.session.login || req.signedCookies.user) {
    if (req.body) {
      if (req.body.title && req.body.content) {
        const newArticle = {
          id: req.session.userId ? req.session.userId : req.signedCookies.user,
          title: req.body.title,
          content: req.body.content,
        };

        const client = await mongoClient.connect();
        const cursor = client.db('kdt1').collection('board');
        await cursor.insertOne(newArticle);
        res.redirect('/board');
      } else {
        const err = new Error('요청 이상');
        err.statusCode = 404;
        throw err;
      }
    } else {
      const err = new Error('요청에 데이터가 없습니다');
      err.statusCode = 404;
      throw err;
    }
  } else if (req.user) {
    if (req.body) {
      if (req.body.title && req.body.content) {
        const newArticle = {
          id: req.user.id,
          title: req.body.title,
          content: req.body.content,
        };

        const client = await mongoClient.connect();
        const cursor = client.db('kdt1').collection('board');
        await cursor.insertOne(newArticle);
        res.redirect('/board');
      } else {
        const err = new Error('요청 이상');
        err.statusCode = 404;
        throw err;
      }
    } else {
      const err = new Error('요청에 데이터가 없습니다');
      err.statusCode = 404;
      throw err;
    }
  } else {
    res.send('로그인 해주세요.<br><a href="/login">로그인 페이지로 이동</a>');
  }
});

router.post('/title/:title', async (req, res) => {
  if (req.session.login || req.user || req.signedCookies.user) {
    if (req.body) {
      if (req.body.title && req.body.content) {
        const client = await mongoClient.connect();
        const cursor = client.db('kdt1').collection('board');
        await cursor.updateOne(
          { title: req.params.title },
          { $set: { title: req.body.title, content: req.body.content } }
        );
        res.redirect('/board');
      } else {
        const err = new Error('해당 제목의 글이 없습니다.');
        err.statusCode = 404;
        throw err;
      }
    } else {
      const err = new Error('요청 쿼리 이상');
      err.statusCode = 404;
      throw err;
    }
  } else {
    res.send('로그인 해주세요.<br><a href="/login">로그인 페이지로 이동</a>');
  }
});

router.delete('/title/:title', async (req, res) => {
  if (req.session.login || req.user || req.signedCookies.user) {
    const client = await mongoClient.connect();
    const cursor = client.db('kdt1').collection('board');
    const result = await cursor.deleteOne({ title: req.params.title });

    if (result.acknowledged) {
      res.send('삭제 완료');
    } else {
      res.end('삭제 이상');
    }
  } else {
    res.send('로그인 해주세요.<br><a href="/login">로그인 페이지로 이동</a>');
  }
});

router.get('/write', (req, res) => {
  if (req.session.login || req.user || req.signedCookies.user) {
    res.render('board_write');
  } else {
    res.send('로그인 해주세요.<br><a href="/login">로그인 페이지로 이동</a>');
  }
});

router.get('/modify/:title', async (req, res) => {
  if (req.session.login || req.user || req.signedCookies.user) {
    const client = await mongoClient.connect();
    const cursor = client.db('kdt1').collection('board');
    const ARTICLE = await cursor.find({}).toArray();
    const arrIndex = ARTICLE.findIndex(
      (_article) => _article.title === req.params.title
    );
    const selectedArticle = ARTICLE[arrIndex];
    res.render('board_modify', { selectedArticle });
  } else {
    res.send('로그인 해주세요.<br><a href="/login">로그인 페이지로 이동</a>');
  }
});

module.exports = router;
