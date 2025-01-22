import Board from "./board/Board";

class ChessEngine {
    private _board: any;
    constructor() {
        this.start()

        this.update()
    }
    public start(){
        this._board = new Board();
    }
    public update(){

        this._board.printBoard();
    }
    private checkForMate() {

    }
}

export default ChessEngine;