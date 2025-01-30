import { Figure } from "@/utils/figures"
import { Board, Position } from "@/utils/board"

class Rook extends Figure {
  constructor(color: "white" | "black", position: Position, board: Board) {
    super("rook", color, position, board)
  }

  isValidMove(target: Position): boolean {
    if (!this.isPositionValid(target)) return false
    if (target.figure?.color === this.color) return false

    const deltaX = target.x - this.position.x
    const deltaY = target.y - this.position.y

    if (deltaX !== 0 && deltaY !== 0) {
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
      let currentPosition = this._board.getPositionByCords(currentX, currentY)
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
  // private isPathBlocked(target: Position): boolean {
  //   const dx = Math.sign(this.position.x - target.x)
  //   const dy = Math.sign(this.position.y - target.y)
  //   if (target.x === this.position.x) {
  //     for (let i = 1; i <= dx; i++) {}
  //   }
  //   if (target.y === this.position.y) {
  //   }
  // }

  // private isPathBlocked(target: Position): boolean {
  //   // ✅ Ensure the target is in a valid rook direction
  //   if (this.position.x !== target.x && this.position.y !== target.y) {
  //     return false // Rook only moves straight
  //   }
  //
  //   // ✅ Determine movement direction (horizontal or vertical)
  //   const directionX = target.x === this.position.x ? 0 : Math.sign(target.x - this.position.x)
  //   const directionY = target.y === this.position.y ? 0 : Math.sign(target.y - this.position.y)
  //
  //   let currentX = this.position.x + directionX
  //   let currentY = this.position.y + directionY
  //   let encounteredFigure = false
  //
  //   // ✅ Loop until reaching the target position
  //   while (currentX !== target.x || currentY !== target.y) {
  //     // Prevent out-of-bounds movement
  //     if (currentX < 0 || currentX > 7 || currentY < 0 || currentY > 7) {
  //       return false // Invalid move, out of board range
  //     }
  //
  //     const currentPosition = this._board.getPositionByCords(currentX, currentY)
  //     if (!currentPosition) return false // Safety check
  //
  //     if (currentPosition.figure) {
  //       if (encounteredFigure) return false // If a second figure is encountered, move is blocked
  //       encounteredFigure = true // Allow the last iteration to run
  //     }
  //
  //     // ✅ Move further along the direction
  //     currentX += directionX
  //     currentY += directionY
  //   }
  //
  //   return true // Move is valid if it reached the target
  // }
  override move(target: Position): boolean {
    return super.move(target)
  }
}

export default Rook
