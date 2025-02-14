import { Board } from "@utils/boardUtils"
import { Pawn, Rook, Knight, Bishop, Queen, King } from "@utils/figureUtils"
import color from "@chesstypes/colorType"

class chessGame {
  private _board: Board
  constructor() {
    this._board = new Board()
    this._board.setupBoard()
  }
  protected start(): void {
    this.process()
  }
  protected process() {
    this.setupFigures()
  }

  protected setupFigures(): void {
    const letters = "abcdefgh" // Corrected to include 'h'

    // Place White Pawns
    for (let i = 0; i < 8; i++) {
      const position = this._board.getPositionByNotation(letters[i] + "2")
      if (position) {
        this._board.addFigureAtPosition(position, new Pawn(color.White, position, this._board))
      }
    }

    // Place White Major Pieces
    this._board.addFigureAtPosition(this._board.getPositionByNotation("a1")!, new Rook(color.White, this._board.getPositionByNotation("a1")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("h1")!, new Rook(color.White, this._board.getPositionByNotation("h1")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("b1")!, new Knight(color.White, this._board.getPositionByNotation("b1")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("g1")!, new Knight(color.White, this._board.getPositionByNotation("g1")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("c1")!, new Bishop(color.White, this._board.getPositionByNotation("c1")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("f1")!, new Bishop(color.White, this._board.getPositionByNotation("f1")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("d1")!, new Queen(color.White, this._board.getPositionByNotation("d1")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("e1")!, new King(color.White, this._board.getPositionByNotation("e1")!, this._board))

    // Place Black Pawns
    for (let i = 0; i < 8; i++) {
      const position = this._board.getPositionByNotation(letters[i] + "7")
      if (position) {
        this._board.addFigureAtPosition(position, new Pawn(color.Black, position, this._board))
      }
    }

    // Place Black Major Pieces
    this._board.addFigureAtPosition(this._board.getPositionByNotation("a8")!, new Rook(color.Black, this._board.getPositionByNotation("a8")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("h8")!, new Rook(color.Black, this._board.getPositionByNotation("h8")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("b8")!, new Knight(color.Black, this._board.getPositionByNotation("b8")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("g8")!, new Knight(color.Black, this._board.getPositionByNotation("g8")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("c8")!, new Bishop(color.Black, this._board.getPositionByNotation("c8")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("f8")!, new Bishop(color.Black, this._board.getPositionByNotation("f8")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("d8")!, new Queen(color.Black, this._board.getPositionByNotation("d8")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("e8")!, new King(color.Black, this._board.getPositionByNotation("e8")!, this._board))

    console.log("Figures placed on the board.")
  }
}

export default chessGame
