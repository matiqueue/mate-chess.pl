import { Figure, Rook } from "@/utils/figures"
import { Board, Position } from "@/utils/board"

class King extends Figure {
  private isCheck: boolean = false
  public wasRoszadeMade: boolean = false
  constructor(color: "white" | "black", position: Position, board: Board) {
    super("king", color, position, board)
  }
  isValidMove(target: Position): boolean {
    //standard movement
    if (Math.abs(target.x - this.position.x) <= 1 && Math.abs(target.y - this.position.y) <= 1) {
      return true
    }
        //roschade, roszade, roschade? chuj wie 
        else if(target?.figure instanceof Rook && !this.wasRoszadeMade){
          const rook = target?.figure as Rook
          if(rook.wasRoszadeMade){
            return false
          }
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
          const currentPosition = this._board.getPositionByCords(currentX, currentY)
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
        if (target.figure && target.figure.color === this.color){
          return false
        }
    return false
  }
  override move(target: Position): boolean {
    return super.move(target)
  }
}

export default King
