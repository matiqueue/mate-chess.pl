import { Figure } from "@/utils/figures"
import { Board, Position } from "@/utils/board"

class Queen extends Figure {
  constructor(color: "white" | "black", position: Position, board: Board) {
    super("queen", color, position, board)
  }
  isValidMove(target: Position): boolean {
    if (!this.isPositionValid(target)) return false
    // if (this.isPathBlocked(target)) return false
    if (Math.abs(target.x - this.position.x) === Math.abs(target.y - this.position.y) || this.position.x === target.x || this.position.y === target.y) {
      if (target.figure && target.figure.color === this.color) return false
      return true
    }
    return false
  }
  // private isPathBlocked(target: Position): boolean {
  //   const isDiagonal = Math.abs(this.position.x - target.x) === Math.abs(this.position.y - target.y)
  //   const isStraight = this.position.x === target.x || this.position.y === target.y
  //
  //   if (!isDiagonal && !isStraight) {
  //     return true // Queen moves only straight or diagonally
  //   }
  //
  //   const directionX = isStraight ? (this.position.x === target.x ? 0 : Math.sign(target.x - this.position.x)) : Math.sign(target.x - this.position.x)
  //   const directionY = isStraight ? (this.position.y === target.y ? 0 : Math.sign(target.y - this.position.y)) : Math.sign(target.y - this.position.y)
  //
  //   let currentX = this.position.x + directionX
  //   let currentY = this.position.y + directionY
  //   let foundEnemy = false
  //
  //   while (currentX !== target.x || currentY !== target.y) {
  //     // ✅ Stop exactly at the target
  //     if (currentX < 0 || currentX > 7 || currentY < 0 || currentY > 7) {
  //       return true // Prevent out-of-bounds error
  //     }
  //
  //     const currentPosition = this._board.getPositionByCords(currentX, currentY)
  //     if (!currentPosition) return true // Treat undefined positions as blocked
  //
  //     if (currentPosition.figure) {
  //       if (foundEnemy) return true // Prevent moving past an enemy
  //       if (currentPosition.figure.color !== this.color) {
  //         foundEnemy = true // Allow stopping at the enemy
  //       } else {
  //         return true // Own piece blocks movement
  //       }
  //     }
  //
  //     currentX += directionX
  //     currentY += directionY
  //   }
  //
  //   return foundEnemy
  // }

  override move(target: Position): boolean {
    return super.move(target)
  }
}

export default Queen
