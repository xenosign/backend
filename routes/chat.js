// @ts-check
const express = require('express');

const router = express.Router();

const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ port: 3000 });

router.get('/', (req, res) => {
  // 연결이 수립되면 클라이언트에 메시지를 전송하고 클라이언트로부터의 메시지를 수신한다
  wss.on('connection', (ws) => {
    ws.send('Hello! I am a server.');
    ws.on('message', (message) => {
      console.log('Received: %s', message);
    });
  });
  res.render('chat');
});

module.exports = router;
