import Figure from "../figure"
import Position from "../../position"
import Board from "../../board/board"

class Bishop extends Figure {
  constructor(color: "white" | "black", position: Position, board: Board) {
    super("bishop", color, position, board)
  }
  isValidMove(target: Position): boolean {
    if (Math.abs(target.x - this.position.x) === Math.abs(target.y - this.position.y)) {
      return true
    }
    return false
  }
  move(target: Position): boolean {
    return super.move(target)
  }
}

export default Bishop
