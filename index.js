const express = require('express');
const path = require('path');
const fs = require('fs');
const ws = require('ws');

const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

let users = new Map();

function addUser(username, socket) {
  users.set(username, socket);
}

function initialHand() {
  const b = JSON.parse(fs.readFileSync('./views/board_data.json', 'utf-8'));
  let hand = new Set();
  while (hand.size !== 7) {
    const ind = Math.floor(Math.random() * Object.keys(b).length);
    const card = Object.keys(b)[ind];
    if(b[card] != "blank_card"){
      hand.add(b[card]);
    }
  }
  console.log(Array.from(hand));
  return Array.from(hand);
}

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/game', (req, res) => {
  const username = req.query.username;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(username, ip);
  const boardData = JSON.parse(fs.readFileSync('./views/board_data.json', 'utf-8'));
  res.render('index', { boardData, username });
});

app.get('/api', (req, res) => {
  res.json({ "msg": "Hello world" });
});

const server = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

const wss = new ws.Server({ server });

wss.on('connection', (socket) => {
  console.log('A new client connected!');

  socket.on('message', (message) => {
    console.log(`Received: ${message}`);

    message = JSON.parse(message);

    if (message.type === 'join') {
      addUser(message.username + Date.now(), socket);
      const h = initialHand();
      console.log(h);
      const hand = initialHand();
      socket.send(JSON.stringify({ type: 'hand', hand }));
    }

    console.log(users);

    socket.send(JSON.stringify({type: 'mssg',m:'Added Successfully'}));
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});