// @ts-check

const express = require('express');

const router = express.Router();

// const mongoClient = require('./mongo');

// async function getUsers() {
//   const client = await mongoClient.connect();
//   const cursor = client.db('kdt1').collection('users').find();
//   const data = await cursor.toArray();
//   return data;
// }

// async function updateUsers(data) {
//   const client = await mongoClient.connect();
//   const cursor = client.db('kdt1').collection('users');
//   await cursor.deleteMany({});
//   await cursor.insertMany(data);
//   const dbs = client.db('kdt1').collection('users').find();
//   const result = await dbs.toArray();
//   return result;
// }

router.get('/', async (req, res) => {
  const USER = await getUsers();
  const userLen = USER.length;
  res.render('users', {
    USER,
    userCounts: userLen,
    imgSrc: './images/done.png',
  });
});

router.get('/:id', async (req, res) => {
  const USER = await getUsers();
  const userData = USER.find((user) => user.id === req.params.id);
  if (userData) {
    res.send(userData);
  } else {
    const err = new Error('ID not found');
    err.statusCode = 404;
    throw err;
  }
});

router.post('/', async (req, res) => {
  const USER = await getUsers();
  console.log(USER);
  if (Object.keys(req.query).length >= 1) {
    if (req.query.id && req.query.name && req.query.email) {
      const newUser = {
        id: req.query.id,
        name: req.query.name,
        email: req.query.email,
      };
      USER.push(newUser);
      await updateUsers(USER);
      res.redirect('/users');
    } else {
      const err = new Error('Unexpected query');
      err.statusCode = 404;
      throw err;
    }
  } else if (req.body) {
    if (req.body.id && req.body.name && req.body.email) {
      const newUser = {
        id: req.body.id,
        name: req.body.name,
        email: req.query.email,
      };
      USER.push(newUser);
      await updateUsers(USER);
      res.redirect('/users');
    } else {
      const err = new Error('Unexpected query');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('No data');
    err.statusCode = 404;
    throw err;
  }
});

router.put('/:id', async (req, res) => {
  const USER = await getUsers();
  if (req.query.id && req.query.name) {
    const userData = USER.find((user) => user.id === req.params.id);
    if (userData) {
      const arrIndex = USER.findIndex((user) => user.id === req.params.id);
      const modifyUser = {
        id: req.query.id,
        name: req.query.name,
        email: req.query.email,
      };
      USER[arrIndex] = modifyUser;
      await updateUsers(USER);
      res.redirect('/users');
    } else {
      const err = new Error('ID not found');
      err.statusCode = 404;
      throw err;
    }
  }
});

router.delete('/:id', async (req, res) => {
  const USER = await getUsers();
  const arrIndex = USER.findIndex((user) => user.id === req.params.id);
  console.log(USER);
  if (arrIndex !== -1) {
    USER.splice(arrIndex, 1);
    const result = await updateUsers(USER);
    res.redirect('/users');
  } else {
    const err = new Error('ID not found');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = router;
