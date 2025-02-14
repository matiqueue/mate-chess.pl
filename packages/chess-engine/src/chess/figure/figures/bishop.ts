import { Figure } from "@utils/figureUtils"
import figureType from "@chesstypes/figureType"
import color from "@chesstypes/colorType"
import { Board, Position } from "@utils/boardUtils"

class Queen extends Figure {
  constructor(type: figureType, color: color, position: Position, board: Board) {
    super(type, color, position, board)
  }

  override isPositionValid(target: Position): boolean {
    if (!this.isPositionExisting(target)) return false
    const deltaX = target.x - this.position.x
    const deltaY = target.y - this.position.y

    if (Math.abs(deltaX) !== Math.abs(deltaY)) {
      return false
    }
    return true
  }

  override isMoveValid(target: Position): boolean {
    if (!this.isPositionValid(target)) return false
    if (target.figure?.color === this.color) return false

    const deltaX = target.x - this.position.x
    const deltaY = target.y - this.position.y

    if (Math.abs(deltaX) !== Math.abs(deltaY)) {
      return false
    }
    const signX = deltaX > 0 ? 1 : -1
    const signY = deltaY > 0 ? 1 : -1

    let currentX = target.x - signX
    let currentY = target.y - signY
    if (currentX > 7 || currentX < 0 || currentY > 7 || currentY < 0) {
      return false
    }
    while (currentX !== this.position.x || currentY !== this.position.y) {
      const currentPosition = this._board.getPositionByCords(currentX, currentY)
      if (!currentPosition) {
        return false
      }
      if (currentPosition.figure) {
        return false
      }
      currentX -= signX
      currentY -= signY
    }
    return true
  }
}
export default Queen
