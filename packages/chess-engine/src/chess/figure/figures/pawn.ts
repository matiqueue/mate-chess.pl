import { Figure } from "@utils/figureUtils"
import { figureType } from "@shared/types/figureType"
import { color } from "@shared/types/colorType"
import { Board, Position } from "@utils/boardUtils"

class Pawn extends Figure {
  private _isFirstMove: boolean
  public isEnPassantPossible: boolean = false

  constructor(color: color.White | color.Black, position: Position, board: Board) {
    super(figureType.pawn, color, position, board)
    if (position.y === 6 || position.y === 1) {
      this._isFirstMove = true
    } else this._isFirstMove = false
  }

  override isPositionValid(target: Position): boolean {
    if (!this.isPositionExisting(target)) return false
    switch (this.color) {
      case color.White:
        //standard move fwd
        if (target.x === this.position.x && target.y === this.position.y - 1) {
          return true
        }
        //standard diagonal attack
        if (Math.abs(target.x - this.position.x) === 1 && target.y === this.position.y - 1) {
          return true
        }
        //2 fields move fwd + attack
        if (this._isFirstMove) {
          //2 fields fwd
          if (target.x === this.position.x && target.y === this.position.y - 2) return true
          //attack
          if (Math.abs(target.x - this.position.x) === 1 && target.y === this.position.y - 2) return true
        }
        return false
      case color.Black:
        //standard move fwd
        if (target.x === this.position.x && target.y === this.position.y + 1) {
          return true
        }
        //standard diagonal attack
        if (Math.abs(target.x - this.position.x) === 1 && target.y === this.position.y + 1) {
          return true
        }
        //2 fields move fwd + attack
        if (this._isFirstMove) {
          //2 fields fwd
          if (target.x === this.position.x && target.y === this.position.y + 2) return true
          //attack
          if (Math.abs(target.x - this.position.x) === 1 && target.y === this.position.y + 2) return true
        }
        return false
    }
  }

  override isMoveValid(target: Position): boolean {
    if (!this.isPositionValid(target)) return false

    const leftPosition = this._board.getPositionByCords(this.position.x - 1, this.position.y)
    const rightPosition = this._board.getPositionByCords(this.position.x + 1, this.position.y)

    const leftFigure = leftPosition?.figure
    const rightFigure = rightPosition?.figure

    //standard fwd move
    if (target.x === this.position.x && !target.figure && Math.abs(target.y - this.position.y) === 1) {
      return true
    }
    //standard diagonal attack
    if (Math.abs(target.x - this.position.x) === 1 && Math.abs(target.y - this.position.y) === 1 && target.figure && target.figure?.color !== this.color) {
      return true
    }
    // 2 fields move forward
    if (target.x === this.position.x && !target.figure && Math.abs(target.y - this.position.y) === 2) {
      switch (this.color) {
        case color.White:
          if (
            this._isFirstMove &&
            target.y === this.position.y - 2 &&
            !target.figure &&
            !this._board.getPositionByCords(target.x, this.position.y - 1)?.figure // Check if path is blocked
          ) {
            return true
          }
          break
        case color.Black:
          if (
            this._isFirstMove &&
            target.y === this.position.y + 2 &&
            !target.figure &&
            !this._board.getPositionByCords(target.x, this.position.y + 1)?.figure // Check if path is blocked
          ) {
            return true
          }
          break
      }
    }
    return false
  }

  get isFirstMove(): boolean {
    return this._isFirstMove
  }

  set isFirstMove(value: boolean) {
    this._isFirstMove = value
  }
}
export default Pawn
