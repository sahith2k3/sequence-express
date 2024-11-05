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
        return this.deck.pop();
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
        this.stat =0 ; //0 denotes not started, 1 denotes started , 2 denotes end
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
            this.playerDecks.push(deck);
            j++;
        }
    }
    addPlayer(player,team)
    {
        if(team<2)
        {
            this.players.push(player);
            this.playerTeamMap.push(team);
            this.playerSize++;
            return 1;
        }
        else
        return -1;
    }
    teamCheck()
    {
        if(this.playerSize%2==0)
        {
            let count=0;
            let j=0;
            while(j<this.playerSize)
            {
                if(this.playerTeamMap[j]==0)
                count++;
                j++;
            }
            if(count*2==this.playerSize)
            {
                let newPlayers = [];
                let newPlayerTeamMap = [];
                j=0;
                let p=0;
                let q=1;
                while(j<this.playerSize)
                {
                    if(this.playerTeamMap[j]==0)
                    {
                        newPlayers[p]=this.players[j];
                        newPlayerTeamMap[p] = this.playerTeamMap[j];
                        p=p+2;
                    }
                    else
                    {
                        newPlayers[q]=this.players[j];
                        newPlayerTeamMap[q] = this.playerTeamMap[j];
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
    playCardOnBoard(x,y,card,color)
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
    getPlayerIndex(player)
    {
        let j=0;
        while(j<this.playerSize && this.players==player)
        j++;
        if(j==this.playerSize)
        return -1;
        else
        return j;
    }
    verfiyCard(playerIndex,card)
    {
        let deck=this.playerDecks[playerIndex];
        let j=0;
        while(j<this.playerDeckSize && deck[j]!=card)
        j++;
        if(j==this.playerDeckSize)
        return false;
        else
        return true;
    }
    removeAndDealCard(playerIndex,card)
    {
        let deck=this.playerDecks[playerIndex];
        let j=0;
        while(j<this.playerDeckSize && deck[j]!=card)
        j++;
        if(j==this.playerDeckSize)
        return -1;
        else
        {
            this.playerDecks[playerIndex][j]=this.deck.draw();
            return 1;
        }
    }
    playCard(player,card,x,y)
    {
        let playerIndex=getPlayerTeam(player);
        if(playerIndex==turn)
        {
            let team=this.playerTeamMap[playerIndex];
            let color=team;
            if(verfiyCard(playerIndex,card)==1)
            {
                if(this.playCardOnBoard(x,y,card,color)!=-1)
                {
                    this.removeAndDealCard();
                    if(this.checkSequence()==false)
                    {
                        this.stat=2;
                    }
                    else
                    {
                        turn=(turn+1)%playerSize;
                        return -2; //continue game
                    }
                }
                else //not valid move
                return -1;
            }
            else //doesnt have that card
            return -1;
            
        }
        else //not his turn
        return -1;
    }
    checkSequence(color)
    {
        return false;
    }
  }
  var myBoard= new Board(10,10);
  var row = [1,2,3,4,5,6,7,8,9,10];
  var sequenceLayout = [
                      [1,2,3,4,5,6,7,8,9,10],
                      [1,2,3,4,5,6,7,8,9,10],
                      [1,2,3,4,5,6,7,8,9,10],
                      [1,2,3,4,5,6,7,8,9,10],
                      [1,2,3,4,5,6,7,8,9,10],
                      [1,2,3,4,5,6,7,8,9,10],
                      [1,2,3,4,5,6,7,8,9,10],
                      [1,2,3,4,5,6,7,8,9,10],
                      [1,2,3,4,5,6,7,8,9,10],
                      [1,2,3,4,5,6,7,8,9,10]
                  ]
  var layoutBoard = new Board(10,10);
  layoutBoard.initializeBoard(sequenceLayout);
  var game = new Game(6);
  var ans = game.playCardOnBoard(1,1,23,1);
  console.log("Initial State");
  game.sequenceBoard.printBoard();
  console.log("Adding users");
  game.addPlayer(101, 0);
  game.addPlayer(102, 0);
  game.addPlayer(103, 0);
  game.addPlayer(104, 1);
  game.addPlayer(105, 1);
  game.addPlayer(106, 1);
  console.log(game);
  console.log("Starting game..");
  game.start();
  console.log(game);
  
  
  