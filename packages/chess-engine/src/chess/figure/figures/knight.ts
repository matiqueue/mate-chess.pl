import { Figure } from "@utils/figureUtils"
import { figureType } from "@shared/types/figureType"
import { color } from "@shared/types/colorType"
import { Board, Position } from "@utils/boardUtils"
import { knightMaterialTable } from "@shared/types/material"

class Knight extends Figure {
  constructor(color: color.White | color.Black, position: Position, board: Board) {
    super(figureType.knight, color, position, board, 3, knightMaterialTable)
  }

  override isPositionValid(target: Position): boolean {
    if (!this.isPositionExisting(target)) return false
    if (target.figure && target.figure.color === this.color) {
      return false
    }
    if (Math.abs(target.x - this.position.x) === 2 && Math.abs(target.y - this.position.y) === 1) {
      return true
    }
    if (Math.abs(target.x - this.position.x) === 1 && Math.abs(target.y - this.position.y) === 2) {
      return true
    }
    return false
  }

  override isMoveValid(target: Position): boolean {
    return this.isPositionValid(target)
  }
}

export default Knight
