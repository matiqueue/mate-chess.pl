import { Figure } from "@utils/figureUtils"
import figureType from "@chesstypes/figureType"
import color from "@chesstypes/colorType"
import { Board, Position } from "@utils/boardUtils"

class King extends Figure {
  private isCheck: boolean = false
  private canCastle: boolean
  constructor(type: figureType, color: color, position: Position, board: Board) {
    super(type, color, position, board)
    this.canCastle = this.position === this._board.getPositionByNotation("e1") || this.position === this._board.getPositionByNotation("e8")
  }

  override isPositionValid(target: Position): boolean {
    if (!this.isPositionExisting(target)) return false
    //standard movement
    if (Math.abs(target.x - this.position.x) <= 1 && Math.abs(target.y - this.position.y) <= 1) {
      return true
    }
    //roszada
    if (this.canCastle) {
    }
    return false
  }

  override isMoveValid(target: Position): boolean {
    if (!this.isPositionValid(target)) return false
    if (Math.abs(target.x - this.position.x) <= 1 && Math.abs(target.y - this.position.y) <= 1) {
      for (let i = 0; i < this._board.allFigures.length; i++) {
        if (this._board.allFigures[i]?.color !== this.color && this._board.allFigures[i]?.isMoveValid(target)) {
          return false
        }
      }
      return !(target.figure && target.figure.color === this.color)
    }
    return false
  }
}
export default King
