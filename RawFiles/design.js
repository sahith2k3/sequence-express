class SequenceDeck{
    
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
    constructor(playerSize)
    {
        this.n=10;
        this.m=10;
        this.sequenceBoard = new Board(this.n,this.m);
        this.setBonusChips(this.sequenceBoard);
        this.playerSize=playerSize;
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
        if(card%13==11)
        return true;
        else
        return false;
    }
    isOneEyedJack(card)
    {
        if(card%26==11)
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


