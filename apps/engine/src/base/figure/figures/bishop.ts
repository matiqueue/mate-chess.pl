import { Figure } from "@/utils/figures"
import { Board, Position } from "@/utils/board"

class Bishop extends Figure {
  constructor(color: "white" | "black", position: Position, board: Board) {
    super("bishop", color, position, board)
  }
  isValidMove(target: Position): boolean {
    if (!this.isPositionValid(target)) return false
    if (Math.abs(target.x - this.position.x) !== Math.abs(target.y - this.position.y)) {
      return false
    }
    if (target.figure && target.figure.color === this.color) return false

    const deltaX = target.x - this.position.x
    const deltaY = target.y - this.position.y

    // Sprawdzenie, czy ruch jest na ukos
    if (Math.abs(deltaX) !== Math.abs(deltaY)) {
      return false
    }

    const stepX = deltaX > 0 ? 1 : -1
    const stepY = deltaY > 0 ? 1 : -1

    let currentX = this.position.x + stepX
    let currentY = this.position.y + stepY

    while (currentX !== target.x && currentY !== target.y) {
      const currentPosition = this._board.getPositionByCords(currentX, currentY)
      if (!currentPosition) {
        console.error(`Invalid position encountered: (${currentX}, ${currentY})`)
        return false
      }

      if (currentPosition.figure) {
        console.log(`Path blocked by ${currentPosition.figure.type} at ${currentPosition.notation}`)
        return false
      }

      currentX += stepX
      currentY += stepY
    }

    // Opcjonalnie: Sprawdzenie, czy na pozycji docelowej znajduje się figura tej samej koloru
    if (target.figure && target.figure.color === this.color) {
      console.log(`Cannot capture your own piece at ${target.notation}`)
      return false
    }

    return true
  }

  override move(target: Position): boolean {
    return super.move(target)
  }
}

export default Bishop
