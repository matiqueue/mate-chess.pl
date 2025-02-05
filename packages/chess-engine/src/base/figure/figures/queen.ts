import { Figure } from "@modules/utils/figures"
import { Board, Position } from "@modules/utils/board"

class Queen extends Figure {
  constructor(color: "white" | "black", position: Position, board: Board) {
    super("queen", color, position, board)
  }
  isValidMove(target: Position): boolean {
    if (!this.isPositionValid(target)) return false
    if (target.figure?.color === this.color) return false

    const deltaX = target.x - this.position.x
    const deltaY = target.y - this.position.y

    const isDiagonal = Math.abs(deltaX) === Math.abs(deltaY)
    const isStraight = deltaX === 0 || deltaY === 0

    if (!isDiagonal && !isStraight) {
      return false
    }

    const signX = deltaX === 0 ? 0 : deltaX > 0 ? 1 : -1
    const signY = deltaY === 0 ? 0 : deltaY > 0 ? 1 : -1

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
  override move(target: Position): boolean {
    return super.move(target)
  }
}

export default Queen
