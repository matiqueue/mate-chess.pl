import { Figure } from "@/utils/figures"
import { Board, Position } from "@/utils/board"

class King extends Figure {
  private isCheck: boolean = false
  constructor(color: "white" | "black", position: Position, board: Board) {
    super("king", color, position, board)
  }
  isValidMove(target: Position): boolean {
    if (Math.abs(target.x - this.position.x) <= 1 && Math.abs(target.y - this.position.y) <= 1) {
      return true
    }
    return false
  }
  override move(target: Position): boolean {
    return super.move(target)
  }
}

export default King
