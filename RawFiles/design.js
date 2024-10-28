class Game{
    constructor(playerSize)
    {
        this.board = new Board(10,10);
        this.playerSize=playerSize;
        this.b=1;
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


