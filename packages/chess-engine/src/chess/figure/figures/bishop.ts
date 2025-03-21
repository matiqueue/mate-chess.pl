import { Figure } from "@utils/figureUtils"
import { figureType } from "@shared/types/figureType"
import { color } from "@shared/types/colorType"
import { Board, Position } from "@utils/boardUtils"
import { bishopMaterialTable } from "@shared/types/material.js"

class Bishop extends Figure {
  constructor(color: color, position: Position, board: Board) {
    super(figureType.bishop, color, position, board, 3, bishopMaterialTable)
  }

  override isPositionValid(target: Position): boolean {
    if (!this.isPositionExisting(target)) return false
    if (target.x === this.position.x && target.y === this.position.y) return false // No self-move

    const deltaX = target.x - this.position.x
    const deltaY = target.y - this.position.y

    return Math.abs(deltaX) === Math.abs(deltaY) // Ensure diagonal movement
  }

  override isMoveValid(target: Position): boolean {
    if (!this.isPositionValid(target)) return false
    if (target.figure?.color === this.color) return false // Prevent landing on own piece

    const deltaX = target.x - this.position.x
    const deltaY = target.y - this.position.y
    const signX = deltaX > 0 ? 1 : -1
    const signY = deltaY > 0 ? 1 : -1

    let currentX = target.x - signX
    let currentY = target.y - signY

    if (currentX > 7 || currentX < 0 || currentY > 7 || currentY < 0) {
      return false
    }

    while (currentX !== this.position.x || currentY !== this.position.y) {
      const currentPosition = this._board.getPositionByCords(currentX, currentY)
      if (!currentPosition) return false
      if (currentPosition.figure) return false // Old collision-checking algorithm restored
      currentX -= signX
      currentY -= signY
    }

    return true
  }
}

export default Bishop
