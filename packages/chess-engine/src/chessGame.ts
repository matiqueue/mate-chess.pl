import { Bishop, Rook, Queen, King, Pawn, Knight } from "./utils/figures"
import ChessEngine from "./base/chessEngine"

class ChessGame extends ChessEngine {
  constructor() {
    super()
  }

  override start() {
    super.start()
    if (!this._board) {
      return
    }
    //ur code here

    console.debug("CHESS GAME LAYER CODE OUTPUT BELOW")

    this._board.printFigures()
  }

  override update() {
    super.update()
    //ur code here
  }
  /**@TODO Ujednolicone ustawianie figur. póki co jest kilka metod od tego. chciałbym zrobić to tak, że jeżeli nic tutaj nie zostało zapisane a metoda nie została wywołana
   * to wtedy występuje standardowe ustawienie figur*/
  // override customFigureSetup() {
  //   // super.customFigureSetup() //call
  //   // //example party
  //   // this._board.addFigureAtPosition(this._board.positions.get("g2")!, new Pawn("white", this._board.positions.get("g2")!)) // White Pawn
  //   // this._board.addFigureAtPosition(this._board.positions.get("f3")!, new Queen("white", this._board.positions.get("f3")!)) // White Queen
  //   // this._board.addFigureAtPosition(this._board.positions.get("e4")!, new King("white", this._board.positions.get("e4")!)) // White King
  //   //
  //   // this._board.addFigureAtPosition(this._board.positions.get("e7")!, new King("black", this._board.positions.get("e7")!)) // Black King
  //   // this._board.addFigureAtPosition(this._board.positions.get("d6")!, new Bishop("black", this._board.positions.get("d6")!)) // Black Bishop
  //   // this._board.addFigureAtPosition(this._board.positions.get("c7")!, new Pawn("black", this._board.positions.get("c7")!)) // Black Pawn
  // }
}
export default ChessGame
