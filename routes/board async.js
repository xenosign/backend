// @ts-check
const express = require('express');

const mongoClient = require('./mongo');

/* eslint-disable-next-line */
// const _client = mongoClient.connect();

const router = express.Router();
// const ARTICLE = [
//   {
//     title: 'title',
//     content:
//       'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia delectus iusto fugiat autem cupiditate adipisci quas, in consectetur repudiandae, soluta, suscipit debitis veniam nobis aspernatur blanditiis ex ipsum tempore impedit.',
//   },
//   {
//     title: 'title2',
//     content:
//       'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia delectus iusto fugiat autem cupiditate adipisci quas, in consectetur repudiandae, soluta, suscipit debitis veniam nobis aspernatur blanditiis ex ipsum tempore impedit.',
//   },
// ];

async function getArticle() {
  const client = await mongoClient.connect();
  const db = client.db('kdt1').collection('board');
  const data = await db.find({}).toArray();
  return data;
}

async function saveArticle(modifiedArticle) {
  const client = await mongoClient.connect();
  const db = client.db('kdt1').collection('board');
  await db.deleteMany({});
  if (Object.keys(modifiedArticle).length !== 0) {
    await db.insertMany(modifiedArticle);
  }
}

router.get('/', async (req, res) => {
  const ARTICLE = await getArticle();
  const articleLen = ARTICLE.length;
  res.render('board', { ARTICLE, articleCounts: articleLen });
});

router.get('/title/:title', async (req, res) => {
  const ARTICLE = await getArticle();
  const article = ARTICLE.find(
    (_article) => _article.title === req.params.title
  );
  if (article) {
    res.send(article);
  } else {
    const err = new Error('해당 제목을 가진 글이 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

router.post('/', async (req, res) => {
  const ARTICLE = await getArticle();
  if (Object.keys(req.query).length >= 1) {
    if (req.query.title && req.query.content) {
      const newArticle = {
        title: req.query.title,
        content: req.query.content,
      };
      ARTICLE.push(newArticle);
      await saveArticle(ARTICLE);
      res.redirect('/board');
    } else {
      const err = new Error('요청 쿼리 이상');
      err.statusCode = 404;
      throw err;
    }
  } else if (req.body) {
    if (req.body.title && req.body.content) {
      const newArticle = {
        title: req.body.title,
        content: req.body.content,
      };
      ARTICLE.push(newArticle);
      await saveArticle(ARTICLE);
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
});

router.post('/title/:title', async (req, res) => {
  const ARTICLE = await getArticle();
  if (Object.keys(req.query).length >= 1) {
    if (req.query.title && req.query.content) {
      const arrIndex = ARTICLE.findIndex(
        (_article) => _article.title === req.params.title
      );
      if (arrIndex !== -1) {
        ARTICLE[arrIndex].title = req.body.title;
        ARTICLE[arrIndex].content = req.body.content;
        await saveArticle(ARTICLE);
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
  } else if (req.body) {
    if (req.body.title && req.body.content) {
      const arrIndex = ARTICLE.findIndex(
        (_article) => _article.title === req.params.title
      );
      if (arrIndex !== -1) {
        ARTICLE[arrIndex].title = req.body.title;
        ARTICLE[arrIndex].content = req.body.content;
        await saveArticle(ARTICLE);
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
    const err = new Error('요청에 데이터가 없습니다');
    err.statusCode = 404;
    throw err;
  }
});

router.delete('/title/:title', async (req, res) => {
  const ARTICLE = await getArticle();
  const arrIndex = ARTICLE.findIndex(
    (_article) => _article.title === req.params.title
  );
  if (arrIndex !== -1) {
    ARTICLE.splice(arrIndex, 1);
    await saveArticle(ARTICLE);
    res.send('삭제 완료!');
    // res.redirect('/board');
  } else {
    const err = new Error('해당 제목을 가진 글이 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

router.get('/write', (req, res) => {
  res.render('board_write');
});

router.get('/modify/:title', async (req, res) => {
  const ARTICLE = await getArticle();
  const arrIndex = ARTICLE.findIndex(
    (_article) => _article.title === req.params.title
  );
  const selectedArticle = ARTICLE[arrIndex];
  await saveArticle(ARTICLE);
  res.render('board_modify', { selectedArticle });
});

module.exports = router;
