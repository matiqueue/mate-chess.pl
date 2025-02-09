import Figure from "../figure"
import Position from "../../position"
import Board from "../../board/board"

class Knight extends Figure {
  constructor(color: "white" | "black", position: Position, board: Board) {
    super("knight", color, position, board)
  }
  isValidMove(target: Position): boolean {
    if (target.figure && target.figure.color === this.color){
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
  override move(target: Position): boolean {
    return super.move(target)
  }
}

export default Knight
