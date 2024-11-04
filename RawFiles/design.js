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
function random_number()
{
    let x=Math.random();
    let y=Math.pow(10,15);
    return Math.floor(x*y);
}
function random_number_between(a,b)
{
    if(a>b)
    {
        let temp=a;
        a=b;
        b=temp;
    }
    let size=(b-a+1);
    let val=random_number();
    val=val%size;
    val=val+a;
    return val;
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
    start()
    {
        let r = this.teamCheck();
        if(r==1)
        {
            this.stat=1;
            this.dealCards();
            this.turn = random_number()%2;
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
layoutBoard.printBoard();
var game = new Game(6);
var ans = game.playCard(1,1,24,1);
game.sequenceBoard.printBoard();


