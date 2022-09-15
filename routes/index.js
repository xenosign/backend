const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.cookie('alert', true, {
    expires: new Date(Date.now() + 1000 * 60),
    httpOnly: true,
  });
  res.render('index', { alert: req.cookies.alert });
});

module.exports = router;
