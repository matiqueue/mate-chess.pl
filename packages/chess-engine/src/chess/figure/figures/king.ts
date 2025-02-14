import { Figure } from "@utils/figureUtils"
import figureType from "@chesstypes/figureType"
import color from "@chesstypes/colorType"
import { Board, Position } from "@utils/boardUtils"

class King extends Figure {
  private _isCheck: boolean = false
  private _hasMoved: boolean
  constructor(type: figureType, color: color, position: Position, board: Board) {
    super(type, color, position, board)
    this._hasMoved = this.position === this._board.getPositionByNotation("e1") || this.position === this._board.getPositionByNotation("e8")
  }

  override isPositionValid(target: Position): boolean {
    if (!this.isPositionExisting(target)) return false
    //standard movement
    if (Math.abs(target.x - this.position.x) <= 1 && Math.abs(target.y - this.position.y) <= 1) {
      return true
    }
    //roszada
    if (!this._hasMoved && Math.abs(target.x - this.position.x) === 2) {
      return this._board.canCastle(this, target)
    }
    return false
  }

  override isMoveValid(target: Position): boolean {
    if (!this.isPositionValid(target)) return false

    // Sprawdzenie, czy król nie wchodzi na szachowane pole
    const opponentFigures = this.color === color.White ? this._board.blackFigures : this._board.whiteFigures

    for (const opponentFigure of opponentFigures) {
      if (opponentFigure.isMoveValid(target)) {
        return false
      }
    }

    return !(target.figure && target.figure.color === this.color)
  }

  get isCheck(): boolean {
    return this._isCheck
  }

  set isCheck(value: boolean) {
    this._isCheck = value
  }

  get hasMoved(): boolean {
    return this._hasMoved
  }

  set hasMoved(value: boolean) {
    this._hasMoved = value
  }
}
export default King
