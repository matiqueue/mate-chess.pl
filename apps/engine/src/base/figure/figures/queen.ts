import Figure from "../figure"
import Position from "../../position"
import Board from "../../board/board"

class Queen extends Figure {
  constructor(color: "white" | "black", position: Position, board: Board) {
    super("queen", color, position, board)
  }
  isValidMove(target: Position): boolean {
    if (Math.abs(target.x - this.position.x) === Math.abs(target.y - this.position.y) || this.position.x === target.x || this.position.y === target.y) {
      if (target.figure && target.figure.color === this.color) return false
      if (this.isPathBlocked(target)) return false
      return true
    }
    return false
  }
  move(target: Position): boolean {
    return super.move(target)
  }
}

export default Queen
