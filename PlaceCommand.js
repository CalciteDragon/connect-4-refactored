class PlaceCommand {
    constructor(x, y, player, board) {
        this.x = x;
        this.y = y;
        this.player = player;
        this.board = board;
    }

    execute() {
        /**update DOM to place piece into HTML table of board */
        this.board[this.y][this.x] = this.player;

        const newPiece = document.createElement('div');
        newPiece.className = 'piece';
        this.player === 1 ? newPiece.classList.add('player1') : newPiece.classList.add('player2');
        const piecePlace = document.getElementById(`${this.y}-${this.x}`);
        if (piecePlace.childElementCount === 0) piecePlace.append(newPiece);
    }

    undo() {
        this.board[this.y][this.x] = null;
        const piecePlace = document.getElementById(`${this.y}-${this.x}`);
        if (piecePlace.childElementCount > 0) {
            piecePlace.removeChild(piecePlace.firstChild);
        }
    }
}