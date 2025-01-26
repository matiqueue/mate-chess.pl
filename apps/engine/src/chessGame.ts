import ChessEngine from "./base/chessEngine"
import board from "./base/board/board"

class ChessGame extends ChessEngine {
    // protected _board: any
    constructor(board: any) {
        super()
    }

    start() {
        super.start()
        //ur code here
        //example: add another pawn at specific position:
        // this._board.addFigureAtPosition(this._board.getPositionByNotation("a3"))
    }

    update() {
        super.update()
        //ur code here
    }
}
export default ChessGame
