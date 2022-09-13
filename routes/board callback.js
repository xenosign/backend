// @ts-check
const express = require('express');

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =
  'mongodb+srv://tetz:qwer1234@cluster0.sdiakr0.mongodb.net/?retryWrites=true&w=majority';

const router = express.Router();

async function getArticle() {
  const client = await _client;
  const db = client.db('kdt1').collection('board');
  const data = await db.find({}).toArray();
  return data;
}

async function saveArticle(modifiedArticle) {
  const client = await _client;
  const db = client.db('kdt1').collection('board');
  await db.deleteMany({});
  if (Object.keys(modifiedArticle).length !== 0) {
    await db.insertMany(modifiedArticle);
  }
}

router.get('/', async (req, res) => {
  MongoClient.connect(uri, (err, db) => {
    const data = db.db('kdt1').collection('board');
    data.find({}).toArray((err, result) => {
      const ARTICLE = result;
      const articleLen = ARTICLE.length;
      res.render('board', { ARTICLE, articleCounts: articleLen });
    });
  });
});

router.get('/write', (req, res) => {
  res.render('board_write');
});

router.post('/', async (req, res) => {
  if (req.body) {
    if (req.body.title && req.body.content) {
      const newArticle = {
        title: req.body.title,
        content: req.body.content,
      };

      MongoClient.connect(uri, (err, db) => {
        const data = db.db('kdt1').collection('board');

        data.insertOne(newArticle, (err, result) => {
          res.redirect('/board');
        });
      });
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

router.get('/modify/:title', async (req, res) => {
  MongoClient.connect(uri, (err, db) => {
    const data = db.db('kdt1').collection('board');

    data.findOne({ title: req.params.title }, (err, result) => {
      if (err) {
        res.send('해당 제목의 글이 없습니다');
      } else {
        const selectedArticle = result;
        res.render('board_modify', { selectedArticle });
      }
    });
  });
});

router.post('/title/:title', async (req, res) => {
  if (req.body) {
    if (req.body.title && req.body.content) {
      MongoClient.connect(uri, (err, db) => {
        const data = db.db('kdt1').collection('board');

        data.updateOne(
          { title: req.params.title },
          { $set: { title: req.body.title, content: req.body.content } },
          (err, result) => {
            if (err) {
              res.send('해당 제목의 글이 없습니다');
            } else {
              res.redirect('/board');
            }
          }
        );
      });
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
  MongoClient.connect(uri, (err, db) => {
    const data = db.db('kdt1').collection('board');

    data.deleteOne({ title: req.params.title }, (err, result) => {
      if (err) {
        res.send('해당 제목의 글이 없습니다');
      } else {
        res.send('삭제 완료');
      }
    });
  });
});

module.exports = router;
