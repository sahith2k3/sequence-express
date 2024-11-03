const express = require('express');
const path = require('path');
const fs = require('fs');
const ws = require('ws');

const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

let users = new Map();
const userHands = new Map();
const userMoves = new Map();

function addUser(username, socket) {
  users.set(username, socket);
}

const card_list =  JSON.parse(fs.readFileSync('./views/board_data.json', 'utf-8'));
delete card_list["0,0"]
delete card_list["0,9"]
delete card_list["9,0"]
delete card_list["9,9"]

//create an array called deck that contains all cards from card_list shuffled
var deck = Object.values(card_list);
deck = deck.sort(() => Math.random() - 0.5);

function givehand(){
  var hand = [];
  for (var i = 0; i < 7; i++) {
    hand.push(deck.pop());
  }
  return hand;
}

function givecard(){
  return deck.pop();
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
      const userId = message.username;
      addUser(userId, socket);      
      
      let hand;
      if (userHands.has(userId)) {
        hand = userHands.get(userId);
      } else {
        hand = givehand();
        userHands.set(userId, hand);
      }      
      
      socket.send(JSON.stringify({ type: 'hand', hand }));

      console.log(users.keys());
      socket.send(JSON.stringify({type: 'mssg',m:'Added Successfully'}));
    }

    if (message.type === 'move') {
      console.log('Playing card: ', message.card);
      socket.send(JSON.stringify({type: "newcard", "card" : givecard()}));
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});