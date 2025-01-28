import ChessEngine from "./base/chessEngine"
import board from "./base/board/board"
import Figure from "./base/figure/figure"
import Pawn from "./base/figure/figures/pawn"
import Queen from "./base/figure/figures/queen"
import King from "./base/figure/figures/king"
import Bishop from "./base/figure/figures/bishop"
import Knight from "./base/figure/figures/knight"
import Rook from "./base/figure/figures/rook"

class ChessGame extends ChessEngine {
  constructor() {
    super()
  }

  start() {
    super.start()
    //ur code here

    console.debug("CHESS GAME LAYER CODE OUTPUT BELOW")
    // this._board.printBoard() //debug
    // this._board.printFigures() // debug
    //example: add figutes at specific location
    // let position = this._board.getPositionByNotation("a3")
    // if (
    //   this._board.addFigureAtPosition(position, new Pawn("white", position))
    // ) {
    //   this._board.getValidMovesForPosition(position)
    // }
    //
    // let position2 = this._board.getPositionByNotation("b6")
    // if (
    //   this._board.addFigureAtPosition(position2, new Knight("black", position2))
    // ) {
    //   this._board.getValidMovesForPosition(position2)
    // }
    //
    // let position3 = this._board.getPositionByNotation("g5")
    // if (
    //   this._board.addFigureAtPosition(position3, new Rook("white", position3))
    // ) {
    //   this._board.getValidMovesForPosition(position3)
    // }
    //
    // let position4 = this._board.getPositionByNotation("d4")
    // if (
    //   this._board.addFigureAtPosition(position4, new Bishop("black", position4))
    // ) {
    //   this._board.getValidMovesForPosition(position4)
    // }
    // let position5 = this._board.getPositionByNotation("b5")
    // if (
    //   this._board.addFigureAtPosition(position5, new King("white", position5))
    // ) {
    //   this._board.getValidMovesForPosition(position5)
    // }

    //en passant test:
    let blackPawnPosition = this._board.getPositionByNotation("d4")
    let whitePawnPosition = this._board.getPositionByNotation("c4")
    if (this._board.addFigureAtPosition(whitePawnPosition, new Pawn("white", whitePawnPosition, this._board))) {
      console.log("valid moves for white pawn: \n")
      this._board.getValidMovesForPosition(whitePawnPosition)
    }
    if (this._board.addFigureAtPosition(blackPawnPosition, new Pawn("black", blackPawnPosition, this._board))) {
      console.log("valid moves for black pawn: \nshould include en passant -> swipe to c3 position. \n")
      this._board.getValidMovesForPosition(blackPawnPosition)
    }

    this._board.printFigures()
  }

  update() {
    super.update()
    //ur code here
  }
  /**@TODO Ujednolicone ustawianie figur. póki co jest kilka metod od tego. chciałbym zrobić to tak, że jeżeli nic tutaj nie zostało zapisane a metoda nie została wywołana
   * to wtedy występuje standardowe ustawienie figur*/
  customFigureSetup() {
    // super.customFigureSetup() //call
    // //example party
    // this._board.addFigureAtPosition(this._board.positions.get("g2")!, new Pawn("white", this._board.positions.get("g2")!)) // White Pawn
    // this._board.addFigureAtPosition(this._board.positions.get("f3")!, new Queen("white", this._board.positions.get("f3")!)) // White Queen
    // this._board.addFigureAtPosition(this._board.positions.get("e4")!, new King("white", this._board.positions.get("e4")!)) // White King
    //
    // this._board.addFigureAtPosition(this._board.positions.get("e7")!, new King("black", this._board.positions.get("e7")!)) // Black King
    // this._board.addFigureAtPosition(this._board.positions.get("d6")!, new Bishop("black", this._board.positions.get("d6")!)) // Black Bishop
    // this._board.addFigureAtPosition(this._board.positions.get("c7")!, new Pawn("black", this._board.positions.get("c7")!)) // Black Pawn
  }
}
export default ChessGame
