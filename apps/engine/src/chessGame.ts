import ChessEngine from "./base/chessEngine"
import board from "./base/board/board"
import Figure from "./base/figure/figure"
import Pawn from "./base/figure/figures/pawn"
import Queen from "./base/figure/figures/queen"
import King from "./base/figure/figures/king"
import Bishop from "./base/figure/figures/bishop"

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
        if (this._board.addFigureAtPosition(position, new Pawn("white", position))) {
            this._board.getValidMovesForPosition(position)
            this._board.printFigures()
        }
    }

    update() {
        super.update()
        //ur code here
    }
    // customFigureSetup() {
    //     super.customFigureSetup() //when called, clears the board
    //     //example party
    //     this._board.addFigureAtPosition(this._board.positions.get("g2")!, new Pawn("white", this._board.positions.get("g2")!)) // White Pawn
    //     this._board.addFigureAtPosition(this._board.positions.get("f3")!, new Queen("white", this._board.positions.get("f3")!)) // White Queen
    //     this._board.addFigureAtPosition(this._board.positions.get("e4")!, new King("white", this._board.positions.get("e4")!)) // White King
    //
    //     this._board.addFigureAtPosition(this._board.positions.get("e7")!, new King("black", this._board.positions.get("e7")!)) // Black King
    //     this._board.addFigureAtPosition(this._board.positions.get("d6")!, new Bishop("black", this._board.positions.get("d6")!)) // Black Bishop
    //     this._board.addFigureAtPosition(this._board.positions.get("c7")!, new Pawn("black", this._board.positions.get("c7")!)) // Black Pawn
    // }
}
export default ChessGame
