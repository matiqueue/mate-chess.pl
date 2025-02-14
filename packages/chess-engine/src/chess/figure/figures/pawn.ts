import { Figure } from "@modules/utils/figureUtils"
import figureType from "@modules/shared/types/figureType"
import color from "@modules/shared/types/colorType"
import { Board, Position } from "@modules/utils/boardUtils"
import board from "@modules/chess/board/board"

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
    if (target.x === this.position.x && !target.figure && Math.abs(target.x - this.position.x) === 1) {
      return true
    }
    //standard diagonal attack
    if (Math.abs(target.x - this.position.x) === 1 && Math.abs(target.y - this.position.y) === 1 && target.figure?.color !== this.color) {
      return true
    }
    //2 fields move fwd
    if (target.x === this.position.x && !target.figure && Math.abs(target.x - this.position.x) === 2) {
      switch (this.color) {
        case color.White:
          //first pawn move fwd
          if (
            this._isFirstMove &&
            target.x === this.position.x &&
            target.y === this.position.y - 2 &&
            !target.figure &&
            !this._board.getPositionByCords(target.x, this.position.y - 1)?.figure
          ) {
            return true
          }
          //en passant below
          if (leftFigure instanceof Pawn && leftFigure.isEnPassantPossible && leftFigure.color !== this.color) {
            if (target.x === this.position.x - 1 && target.y === this.position.y - 1) {
              return true
            }
          } else if (rightFigure instanceof Pawn && rightFigure.isEnPassantPossible && rightFigure.color !== this.color) {
            if (target.x === this.position.x + 1 && target.y === this.position.y - 1) {
              return true
            }
          }
          break
        case color.Black:
          if (
            this._isFirstMove &&
            target.x === this.position.x &&
            target.y === this.position.y + 2 &&
            !target.figure &&
            !this._board.getPositionByCords(target.x, this.position.y + 1)?.figure
          ) {
            return true
          }
          //en passant below
          if (leftFigure instanceof Pawn && leftFigure.isEnPassantPossible && leftFigure.color !== this.color) {
            if (target.x === this.position.x - 1 && target.y === this.position.y + 1) {
              return true
            }
          } else if (rightFigure instanceof Pawn && rightFigure.isEnPassantPossible && rightFigure.color !== this.color) {
            if (target.x === this.position.x + 1 && target.y === this.position.y + 1) {
              return true
            }
          }
          break
      }
    }
    return false
  }
}
export default Pawn
