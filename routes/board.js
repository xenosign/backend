// @ts-check
const express = require('express');

const router = express.Router();

const ARTICLE = [
  {
    title: 'title',
    content:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia delectus iusto fugiat autem cupiditate adipisci quas, in consectetur repudiandae, soluta, suscipit debitis veniam nobis aspernatur blanditiis ex ipsum tempore impedit.',
  },
  {
    title: 'title2',
    content:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia delectus iusto fugiat autem cupiditate adipisci quas, in consectetur repudiandae, soluta, suscipit debitis veniam nobis aspernatur blanditiis ex ipsum tempore impedit.',
  },
];

router.get('/', (req, res) => {
  const articleLen = ARTICLE.length;
  res.render('board', { ARTICLE, articleCounts: articleLen });
});

router.get('/write', (req, res) => {
  res.render('board_write');
});

router.post('/', (req, res) => {
  if (req.body.title && req.body.content) {
    const newArticle = {
      title: req.body.title,
      content: req.body.content,
    };
    ARTICLE.push(newArticle);
    res.redirect('/board');
  } else {
    const err = new Error('요청 이상');
    err.statusCode = 404;
    throw err;
  }
});

router.get('/modify/:title', (req, res) => {
  const arrIndex = ARTICLE.findIndex(
    (_article) => _article.title === req.params.title
  );
  const selectedArticle = ARTICLE[arrIndex];
  res.render('board_modify', { selectedArticle });
});

router.post('/title/:title', (req, res) => {
  if (req.body.title && req.body.content) {
    const arrIndex = ARTICLE.findIndex(
      (_article) => _article.title === req.params.title
    );
    if (arrIndex !== -1) {
      ARTICLE[arrIndex].title = req.body.title;
      ARTICLE[arrIndex].content = req.body.content;
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
});

router.delete('/title/:title', (req, res) => {
  const arrIndex = ARTICLE.findIndex(
    (_article) => _article.title === req.params.title
  );
  if (arrIndex !== -1) {
    ARTICLE.splice(arrIndex, 1);
    res.send('삭제 완료!');
  } else {
    const err = new Error('해당 제목을 가진 글이 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = router;
