class Game{
    constructor(playerSize)
    {
        this.n=10;
        this.m=10;
        this.sequenceBoard = new Board(n,m);
        this.playerSize=playerSize;
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
    placeToken(x,y,color) //1 is red , 2 is black , 3 is blue , 0 is null
    {
        if(isFree(x,y))
        this.sequenceBoard.setVal(x,y,color);
    }
    forcePlaceToken(x,y,color)
    {
        this.sequenceBoard.setVal(x,y,color);
    }
    removeToken(x,y)
    {
        this.sequenceBoard.setVal(x,y,0);
    }
    checkSequence()
    {
        
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
        if(x<this.n && validateIntRow(row,this.m))
        this.board[x]=row;
    }
    
}
var myBoard= new Board(10,10);
var row = [1,2,3];
var ans=myBoard.validateIntRow(row,4);
console.log(ans);


