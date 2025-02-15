import Board from "@modules/chess/board/board"
import { Move } from "@shared/types/moveType"
import { figureType } from "@shared/types/figureType"
import MoveRecord from "@shared/types/moveRecord"
import { color } from "@shared/types/colorType"
import { King, Pawn } from "@utils/figureUtils"
import ChessGame from "@modules/chess/chessGame"

class MoveRecorder {
  private _board: Board
  private _gameInstance: ChessGame
  private _moves: MoveRecord[] = []

  constructor(board: Board, game: ChessGame) {
    this._board = board
    this._gameInstance = game
  }

  public recordMove(figure: figureType, move: Move, targetFigure: figureType | null | undefined, specialMove: string = ""): boolean {
    let moveName = ""

    // Determine the piece notation (except for pawns)
    switch (figure) {
      case figureType.king:
        moveName += "K"
        break
      case figureType.knight:
        moveName += "N"
        break
      case figureType.bishop:
        moveName += "B"
        break
      case figureType.queen:
        moveName += "Q"
        break
      case figureType.rook:
        moveName += "R"
        break
      case figureType.pawn:
        // For pawn, the notation starts with the column if it captures (exd6)
        if (targetFigure) {
          moveName += move.from.notation[0]
        }
        break
    }

    // Capture notation ("x")
    if (targetFigure) {
      moveName += "x"
    }

    // Append destination notation
    moveName += move.to.notation

    // Handle special moves
    if (specialMove) {
      moveName = specialMove // Castling, En Passant, etc.
    }

    // Check for check or checkmate
    if (this._board.isCheckmate() === this._gameInstance.currentPlayer) {
      moveName += "#" // Checkmate
    } else if (this._board.isKingInCheck(this._gameInstance.currentPlayer)) {
      moveName += "+" // Check
    }

    // Add to move list
    this._moves.push(new MoveRecord(moveName, this._moves.length + 1))
    return true
  }

  public recordCastling(isKingside: boolean, color: color.White | color.Black): boolean {
    const moveName = isKingside ? "O-O" : "O-O-O" // Kingside or Queenside castling
    this._moves.push(new MoveRecord(moveName, this._moves.length + 1))
    return true
  }

  public recordPromotion(move: Move, promotionTo: figureType): boolean {
    let moveName = move.to.notation + "="
    switch (promotionTo) {
      case figureType.queen:
        moveName += "Q"
        break
      case figureType.rook:
        moveName += "R"
        break
      case figureType.bishop:
        moveName += "B"
        break
      case figureType.knight:
        moveName += "N"
        break
    }
    this._moves.push(new MoveRecord(moveName, this._moves.length + 1))
    return true
  }

  public recordEnPassant(move: Move): boolean {
    const moveName = move.from.notation[0] + "x" + move.to.notation + " e.p."
    this._moves.push(new MoveRecord(moveName, this._moves.length + 1))
    return true
  }

  public getMoves(): MoveRecord[] {
    return this._moves
  }

  public getLastMove(): MoveRecord | null | undefined {
    return this._moves.length > 0 ? this._moves[this._moves.length - 1] : null
  }

  public undoLastMove(): boolean {
    if (this._moves.length > 0) {
      this._moves.pop()
      return true
    }
    return false
  }
}

export default MoveRecorder
