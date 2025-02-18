import { Board } from "@utils/boardUtils"
import { Bishop, King, Knight, Pawn, Queen, Rook } from "@utils/figureUtils"
import { color } from "@shared/types/colorType"
import { Move } from "@shared/types/moveType"
import MoveRecord from "@shared/types/moveRecord"
import { figureType } from "@shared/types/figureType"

class chessGame {
  private _board: Board
  private _currentPlayer: color.White | color.Black
  // private _moveRecorder: MoveRecorder
  private _moves: MoveRecord[] = []
  private _isGameOn: boolean = false
  private _gameStatus: "active" | "draw" | "black wins" | "white wins" | "stalemate" | "stop" = "stop"
  constructor() {
    this._board = new Board()
    this._board.setupBoard()
    this.setupFigures()
    this._currentPlayer = color.White
    // this._moveRecorder = new MoveRecorder(this._board, this)
  }
  start(): void {
    this._gameStatus = "active"
    this._isGameOn = true
    this.process()
  }
  protected process() {
    if (this._board.isCheckmate() === this.currentPlayer) {
      console.error(`${this.currentPlayer} is checkmated!`)
      if (this.currentPlayer === color.Black) {
        this._gameStatus = "white wins"
      } else if (this.currentPlayer === color.White) {
        this._gameStatus = "black wins"
      }
      this._isGameOn = false
    } else if (this._board.isStalemate()) {
      console.error(`Stalemate! The game is a draw.`)
      this._gameStatus = "stalemate"
      this._isGameOn = false
    }
    // this._board.printFigures()
    // this._board.printBoard()
    // this._board.printCords()
    // this._board.printIds()
    //
    // const move: Move = {
    //   from: this._board.getPositionByNotation("e2")!,
    //   to: this._board.getPositionByNotation("e3")!,
    // }
    // this._board.moveFigure(move)
    // this._board.printFigures()
    this._moves = this._board.moveHistory
    console.log(this.getMoveHistory())
  }
  public makeMove(move: Move): boolean {
    if (!this._isGameOn) return false
    if (move.from.figure?.color === this.currentPlayer) {
      const figure = this._board.getFigureAtPosition(move.from)
      const targetFigure = this._board.getFigureAtPosition(move.to)
      if (this._board?.moveFigure(move)) {
        this.switchCurrentPlayer()
        if (figure) {
          // this._moveRecorder.recordMove(figure.type, move, targetFigure?.type)
        }
        return true
      }
    }
    return false
  }
  public undoMove(): boolean {
    const succes = this._board.undoLastMove()
    if (succes) this.switchCurrentPlayer()

    return succes
  }
  public getMoveHistory(): string[] {
    const result: string[] = []
    for (let i = 0; i < this._moves.length; i += 2) {
      // Biały ruch
      const whiteRecord = this._moves[i]!
      const whiteFigure = whiteRecord!.figurePerforming
      const whiteCaptured = whiteRecord!.figureCaptured
      let whiteNotation = ""
      switch (whiteFigure.type) {
        case figureType.queen:
          whiteNotation = "Q"
          break
        case figureType.rook:
          whiteNotation = "R"
          break
        case figureType.knight:
          whiteNotation = "N"
          break
        case figureType.king:
          whiteNotation = "K"
          break
        case figureType.bishop:
          whiteNotation = "B"
          break
        default:
          whiteNotation = ""
      }
      const whiteCapture = whiteCaptured ? "x" : ""
      const whitePos = this.board.getPosition(whiteRecord!.move.to)?.notation ?? ""
      const whiteMove = `${whiteNotation}${whiteCapture}${whitePos}`

      let line = `${i / 2 + 1}. White: ${whiteMove}`

      // Czarny ruch, jeśli istnieje
      if (i + 1 < this._moves.length) {
        const blackRecord = this._moves[i + 1]!
        const blackFigure = blackRecord!.figurePerforming
        const blackCaptured = blackRecord!.figureCaptured
        let blackNotation = ""
        switch (blackFigure.type) {
          case figureType.queen:
            blackNotation = "Q"
            break
          case figureType.rook:
            blackNotation = "R"
            break
          case figureType.knight:
            blackNotation = "N"
            break
          case figureType.king:
            blackNotation = "K"
            break
          case figureType.bishop:
            blackNotation = "B"
            break
          default:
            blackNotation = ""
        }
        const blackCapture = blackCaptured ? "x" : ""
        const blackPos = this.board.getPosition(blackRecord!.move.to)?.notation ?? ""
        const blackMove = `${blackNotation}${blackCapture}${blackPos}`

        line += ` Black: ${blackMove}`
      }

      result.push(line)
    }
    return result
  }
  public gameDraw() {
    this._gameStatus = "draw"
    this._isGameOn = false
  }
  private switchCurrentPlayer() {
    if (this.currentPlayer === color.White) {
      this.currentPlayer = color.Black
    } else if (this.currentPlayer === color.Black) {
      this.currentPlayer = color.White
    }
  }
  get currentPlayer(): color.White | color.Black {
    return this._currentPlayer
  }

  set currentPlayer(value: color.White | color.Black) {
    this._currentPlayer = value
  }

  get board(): Board {
    return this._board
  }

  get isGameOn(): boolean {
    return this._isGameOn
  }

  set gameStatus(value: "active" | "draw" | "black wins" | "white wins" | "stalemate" | "stop") {
    this._gameStatus = value
  }

  get gameStatus(): "active" | "draw" | "black wins" | "white wins" | "stalemate" | "stop" {
    return this._gameStatus
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

    console.log(this.board.getBoardArray())
    console.trace()
  }
}

export default chessGame
