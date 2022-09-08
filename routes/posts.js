// @ts-check

const express = require('express');

const router = express.Router();

const POST = [
  { title: 'title', content: 'content' },
  { title: 'test', content: 'test' },
];

router.get('/', (req, res) => {
  const postLen = POST.length;
  res.render('posts', { POST, postCount: postLen });
});

router.get('/:title', (req, res) => {
  const postData = POST.find((post) => post.title === req.params.title);
  if (postData) {
    res.send(postData);
  } else {
    const err = new Error('id not FOUND');
    err.statusCode = 404;
    throw err;
  }
});

router.post('/', (req, res) => {
  console.log(req.body);
  if (req.query.title) {
    if (req.query.title && req.query.content) {
      const newPost = {
        title: req.query.title,
        content: req.query.content,
      };
      POST.push(newPost);
      res.send('포스팅 올리기에 성공했습니다!');
    } else {
      const err = new Error('unexpected Qurey');
      err.statusCode = 404;
      throw err;
    }
  } else if (req.body) {
    if (req.body.title && req.body.content) {
      const newPost = {
        title: req.body.title,
        content: req.body.content,
      };
      POST.push(newPost);
      res.send('포스팅 올리기에 성공했습니다!');
    } else {
      const err = new Error('unexpected query');
      err.statusCode = 404;
    }
  }
});

router.put('/:title', (req, res) => {
  const index = POST.findIndex((post) => post.title === req.params.title);
  if (req.query.title && req.query.content) {
    if (index !== -1) {
      const modiPost = {
        title: req.query.title,
        content: req.query.content,
      };

      POST[index] = modiPost;
      res.send(`${index + 1}번째 포스팅이 수정되었습니다`);
    } else {
      const err = new Error('unexpected Qurey');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('No data');
    err.statusCode = 404;
    throw err;
  }
});

router.delete('/:title', (req, res) => {
  const index = POST.findIndex((post) => req.params.title === post.title);
  if (index !== -1) {
    POST.splice(index, index + 1);
    res.send(`${index + 1}번째 포스팅이 삭제되었습니다`);
  } else {
    const err = new Error('id not found');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = router;
