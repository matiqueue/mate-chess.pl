import Figure from "../figure"
import Position from "../../position"
import Board from "../../board/board"

class Rook extends Figure {
  constructor(color: "white" | "black", position: Position, board: Board) {
    super("rook", color, position, board)
  }

  isValidMove(target: Position): boolean {
    if (this.position.x === target.x || this.position.y === target.y) {
      return true
    }
    return false
  }
  move(target: Position): boolean {
    return super.move(target)
  }
}

export default Rook
