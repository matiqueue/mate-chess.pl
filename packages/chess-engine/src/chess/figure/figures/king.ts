import { Figure, Pawn, Rook } from "@utils/figureUtils"
import { figureType } from "@shared/types/figureType"
import { color } from "@shared/types/colorType"
import { Board, Position } from "@utils/boardUtils"
import { kingMaterialTable } from "@shared/types/material"

/**Chess class for King figure.
 * */
class King extends Figure {
  private _hasMoved: boolean
  constructor(color: color, position: Position, board: Board, hasMoved: boolean = false) {
    super(figureType.king, color, position, board, 1500, kingMaterialTable)
    this._hasMoved = hasMoved
  }

  override isPositionValid(target: Position): boolean {
    if (!this.isPositionExisting(target)) return false
    if (target.figure instanceof Rook && !target.figure.hasMoved && !this._hasMoved && target.figure.color === this.color && target.y === this.position.y) {
      return true
    }
    //standard movement
    if (Math.abs(target.x - this.position.x) <= 1 && Math.abs(target.y - this.position.y) <= 1) {
      return true
    }
    return false
  }

  override isMoveValid(target: Position): boolean {
    if (!this.isPositionValid(target)) return false

    // Sprawdzenie, czy król nie wchodzi na szachowane pole
    const opponentFigures = this.color === color.White ? this._board.blackFigures : this._board.whiteFigures

    if (target.figure instanceof Rook && target.figure.color === this.color) {
      if (target.figure.hasMoved || this.hasMoved) return false

      const deltaX = target.x - this.position.x
      const signX = deltaX === 0 ? 0 : deltaX > 0 ? 1 : -1

      let currentX = target.x - signX

      if (currentX > 7 || currentX < 0) {
        return false
      }

      while (currentX !== this.position.x) {
        const currentPosition = this._board.getPositionByCords(currentX, target.y)
        if (!currentPosition) return false
        if (currentPosition.figure) return false
        currentX -= signX
      }
      return true
    } else if (target.figure && target.figure.color === this.color) return false
    for (const opponentFigure of opponentFigures) {
      if (opponentFigure instanceof Pawn && opponentFigure.isPositionValid(target)) {
        return false
      }
      if (opponentFigure.isMoveValid(target)) {
        return false
      }
    }

    return true
  }
  get hasMoved(): boolean {
    return this._hasMoved
  }

  set hasMoved(value: boolean) {
    this._hasMoved = value
  }
}
export default King
