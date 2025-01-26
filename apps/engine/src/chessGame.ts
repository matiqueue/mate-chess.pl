import ChessEngine from "./base/chessEngine"
import board from "./base/board/board"
import Figure from "./base/figure/figure"
import Pawn from "./base/figure/figures/pawn"

class ChessGame extends ChessEngine {
    constructor() {
        super()
    }

    start() {
        super.start()
        //ur code here
        //example: add another pawn at specific position:
        console.debug("CHESS GAME LAYER CODE OUTPUT BELOW")
        let position = this._board.getPositionByNotation("a3")
        this._board.addFigureAtPosition(position, new Pawn("white", position))

        this._board.getValidMovesForPosition(position)
        this._board.printFigures()
    }

    update() {
        super.update()
        //ur code here
    }
}
export default ChessGame
