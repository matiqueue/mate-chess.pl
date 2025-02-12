import { Board, Position } from "@modules/utils/board"
import { King } from "@modules/utils/figures"

/**
 * Abstract class for all the figures on playing board. Figure types and colours are already predefined.
 * Class imports Position class.
 * */
abstract class Figure {
  private _type: "rook" | "knight" | "bishop" | "queen" | "king" | "pawn"
  private _color: "white" | "black"
  private _position: Position
  private _id: number = 0
  protected _board: Board

  constructor(type: "rook" | "knight" | "bishop" | "queen" | "king" | "pawn", color: "white" | "black", position: Position, board: Board) {
    this._type = type
    this._color = color
    this._position = position
    this._board = board
  }

  get type(): "rook" | "knight" | "bishop" | "queen" | "king" | "pawn" {
    return this._type
  }

  set type(value: "rook" | "knight" | "bishop" | "queen" | "king" | "pawn") {
    this._type = value
  }

  get color(): "white" | "black" {
    return this._color
  }

  set color(value: "white" | "black") {
    this._color = value
  }

  get position(): Position {
    return this._position
  }

  set position(value: Position) {
    this._position = value
  }
  set id(value: number) {
    this._id = value
  }

  get id(): number {
    return this._id
  }
  /**
   * Checks if target position is valid. For the method to return true, it has to be inside the 8x8 chess board
   * */
  protected isPositionValid(target: Position): boolean {
    return !(target.x < 0 || target.x > 7 || target.y < 0 || target.y > 7)
  }
  /**
   * Abstract method to be implemented to children class.
   * Its main purpose is to restrict movement for each figure, so it obeys the rules of chess
   * */
  abstract isValidMove(target: Position): boolean
  public move(target: Position): boolean {
    if (!this.isPositionValid(target)) {
      console.error("Invalid target position: outside of board boundaries.")
      return false
    }

    if (!this.isValidMove(target)) {
      console.log("Invalid move for this piece.")
      return false
    }

    if (this.color === target.figure?.color) {
      console.log("Cannot move to a square occupied by your own piece.")
      return false
    }

    this.capturePiece(target)

    this._board.clearPosition(this.position)
    target.figure = this
    this.position = target
    this._board.figures[this._id] = this

    console.log(this._board.figures)

    return true
  }
  private capturePiece(target: Position): boolean {
    if (target.figure) {
      return this._board.clearPosition(target)
    }
    return false
  }
}
export default Figure
