import { Figure } from "@utils/figureUtils"
import figureType from "@chesstypes/figureType"
import color from "@chesstypes/colorType"
import { Board, Position } from "@utils/boardUtils"

class Knight extends Figure {
  constructor(color: color.White | color.Black, position: Position, board: Board) {
    super(figureType.knight, color, position, board)
  }

  override isPositionValid(target: Position): boolean {
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
