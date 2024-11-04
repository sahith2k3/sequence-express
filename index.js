const express = require('express');
const path = require('path');
const fs = require('fs');
const ws = require('ws');

const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

//classes
class SequenceDeck{
  constructor()
  {
      this.deck=[];
      this.size=104;
      let j=0;
      while(j<this.size)
      {
          this.deck.push(j);
          j++;
      }
      this.shuffle();
  }
  fisherYates(array) 
  {
    let currentIndex = array.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }
  shuffle() 
  {
      this.fisherYates(this.deck);
  }
  isEmpty()
  {
      if(this.n==0)
      return true;
      else
      return false;
  }
  draw()
  {
      return deck.pop();
  }
  
}
class Board{
  constructor(n,m)
  {
      this.n=n;
      this.m=m;
      this.board = [];
      let j=0;
      while(j<n)
      {
          let row = [];
          let k=0;
          while(k<m)
          {
              row.push(0);
              k++;
          }
          this.board.push(row);
          j++;
      }
      
  }
  initializeBoard(board)
  {
      if(board.length==this.n && board[0].length==this.m)
      {
          let j=0;
          while(j<this.n && this.validateIntRow(board[j],this.m))
          {
              this.setRow(j,board[j]);
              j++;
          }
      }
  }
  getVal(x,y)
  {
      if(x<this.n && y<this.m)
      return this.board[x][y];
      else
      return null;
  }
  setVal(x,y,val)
  {
      if(x<this.n && y<this.m)
      this.board[x][y]=val;
  }
  validateIntRow(row,size)
  {
      if(row.length==size)
      {
          let j=0;
          while(j<size && Number.isInteger(row[j]))
          j++;
          return j==size;
      }
      else
      return false;
  }
  setRow(x,row)
  {
      if(x<this.n && this.validateIntRow(row,this.m))
      this.board[x]=row;
      
  }
  printBoard()
  {
      let j=0;
      while(j<this.n)
      {
          let k=0;
          while(k<this.m)
          {
              process.stdout.write(this.board[j][k] + " ");
              k++;
          }
          console.log();
          j++;
      }
  }
  
}
class Game{
  constructor()
  {
      this.n=10;
      this.m=10;
      this.deck = new SequenceDeck();
      this.sequenceBoard = new Board(this.n,this.m);
      this.players = [];
      this.playerSize = 0;
      this.stat =0 ; //0 denotes not started, 1 denotes started
      this.turn = -1;
      this.playerDeckSize = 7; 
      this.playerTeamMap = []; // denotes the team number of that particular player
      this.playerDecks = [];
      this.setBonusChips(this.sequenceBoard);
  }
  setBonusChips(board) // 4 is bonus chip
  {
      let n=board.n;
      let m=board.m;
      board.setVal(0,0,4);
      board.setVal(0,m-1,4);
      board.setVal(n-1,0,4);
      board.setVal(n-1,m-1,4);
  }
  dealCards()
  {
      let j=0;
      while(j<this.playerSize)
      {
          let k=0;
          let deck = [];
          while(k<this.playerDeckSize)
          {
              deck.push(this.deck.draw());
              k++;
          }
          playerDecks.push(deck);
          j++;
      }
  }
  addPlayer(player,team)
  {
      if(team<2)
      {
          this.players.push(player);
          this.playerTeamMap.push(team);
          return 1;
      }
      else
      return -1;
  }
  teamCheck()
  {
      if(playerSize%2==0)
      {
          let count=0;
          let j=0;
          while(j<playerSize)
          {
              if(playerTeamMap[j]==0)
              count++;
              j++;
          }
          if(count*2==playerSize)
          {
              let newPlayers = [];
              let newPlayerTeamMap = [];
              j=0;
              let p=0;
              let q=1;
              while(j<playerSize)
              {
                  if(playerTeamMap[j]==0)
                  {
                      newPlayers[p]=players[j];
                      newPlayerTeamMap = playerTeamMap[j];
                      p=p+2;
                  }
                  else
                  {
                      newPlayers[q]=players[j];
                      newPlayerTeamMap = playerTeamMap[j];
                      q=q+2;
                  }
                  j++;
              }
              this.players=newPlayers;
              this.playerTeamMap = newPlayerTeamMap;
              return 1;
          }
          else
          return -2;
          
      }
      else
      return -1;
      
  }
  random_number()
  {
    let x=Math.random();
    let y=Math.pow(10,15);
    return Math.floor(x*y);
  }
  start()
  {
      let r = this.teamCheck();
      if(r==1)
      {
          this.stat=1;
          this.dealCards();
          this.turn = this.random_number()%2;
          return 1;
      }
      else
      {
          return r;
      }
  }
  validateCoordinates(x,y)
  {
      if(x<this.n && x>=0 && y<this.m && y>=0)
      return true;
      else
      return false;
  }
  isFree(x,y)
  {
      if(this.sequenceBoard.getVal(x,y)==0)
      return true;
      else
      return false;
  }
  placeToken(x,y,color) //1 is red , 2 is black , 3 is blue , 4 is bonus, 0 is empty
  {
      if(this.isFree(x,y))
      {
          this.sequenceBoard.setVal(x,y,color);
          return 1;
      }
      else
      return -1;
  }
  forcePlaceToken(x,y,color)
  {
      this.sequenceBoard.setVal(x,y,color);
  }
  removeToken(x,y)
  {
      this.sequenceBoard.setVal(x,y,0);
  }
  validateCard(x,y,card)
  {
      if(card==layoutBoard.getVal(x,y))
      return true;
      else
      return false;
  }
  isJack(card)
  {
      if(card%13==10)
      return true;
      else
      return false;
  }
  isOneEyedJack(card)
  {
      if(card%26==10)
      return true;
      else
      return false;
  }
  playCard(x,y,card,color)
  {
      if(this.isJack(card))
      {
          if(this.isOneEyedJack(card))
          {
              let placedToken = this.sequenceBoard.getVal(x,y);
              if(placedToken !=0 && placedToken !=4)
              {
                  this.removeToken(x,y);
                  return 1;
              }
              else
              return -1;
          }
          else
          {
              return this.placeToken(x,y,color);
          }
      }
      else
      {
          if(this.validateCard(x,y,card))
          {
              return this.placeToken(x,y,color);
          }
          else
          return -1;
      }
  }
  checkSequence(color)
  {
      
  }
}
// end of class definitions

let users = new Map();
const userHands = new Map();
const userMoves = new Map();

function addUser(username, socket) {
  users.set(username, socket);
}

const card_list = JSON.parse(fs.readFileSync('./views/board_data.json', 'utf-8'));
delete card_list["0,0"]
delete card_list["0,9"]
delete card_list["9,0"]
delete card_list["9,9"]

//create an array called deck that contains all cards from card_list shuffled
var deck = Object.values(card_list);
deck = deck.sort(() => Math.random() - 0.5);

function givehand() {
  var hand = [];
  for (var i = 0; i < 7; i++) {
    hand.push(deck.pop());
  }
  return hand;
}

function givecard() {
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
      socket.send(JSON.stringify({ type: 'mssg', m: 'Added Successfully' }));
    }

    if (message.type === 'move') {
      console.log('Playing card: ', message.card);

      var userhand = userHands.get(message.username);
      var index = userhand.indexOf(message.card);
      userhand.splice(index, 1);
      var newcard = givecard();
      userhand.push(newcard);
      userHands.set(message.username, userhand);

      socket.send(JSON.stringify({ type: "newcard", "card": newcard }));
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});