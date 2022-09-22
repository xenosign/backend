// @ts-check
const express = require('express');

const router = express.Router();
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
  // ws.send('저는 서버입니다! 들리십니까?');

  wss.clients.forEach((client) => {
    client.send(`새로운 유저가 접속 했습니다. 현재 유저 ${wss.clients.size}`);
  });

  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      client.send(`${message}`);
    });
  });

  ws.on('close', () => {
    wss.clients.forEach((client) => {
      client.send(`유저 한명이 떠났습니다. 현재 유저 ${wss.clients.size} 명`);
    });
  });
});

router.get('/', (req, res) => {
  res.render('chat');
});

module.exports = router;
