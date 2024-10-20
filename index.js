const express = require('express');
const path = require('path')
const fs = require('fs');
const ws = require('ws');

const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

let users = [];

function addUser(username, ip) {
  users.push({ username, ip });
}

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/game', (req, res) => {
  const username = req.query.username;
  const ip = req.ip;
  addUser(username, ip);
  const boardData = JSON.parse(fs.readFileSync('./views/board_data.json', 'utf-8'));
  res.render('index', { boardData, users });
});


// app.get('/', (req, res) => {
//   const boardData = JSON.parse(fs.readFileSync('./views/board_data.json', 'utf-8'));
//   res.render('index', { boardData, users });
// });

app.get('/api', (req, res) => {
  res.json({"msg": "Hello world"});
});

// app.listen(port, () => {
//   console.log(`Listening on http://localhost:${port}`);
// })

const server = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

// Create the WebSocket server and attach it to the HTTP server
const wss = new ws.Server({ server });

// WebSocket connection event
wss.on('connection', (socket) => {
  console.log('A new client connected!');

  // Handle incoming messages from the client
  socket.on('message', (message) => {
    console.log(`Received: ${message}`);
    console.log(users);

    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle client disconnection
  socket.on('close', () => {
    console.log('Client disconnected');
  });
});