import { Figure, Rook } from "@modules/utils/figures"
import { Board, Position } from "@modules/utils/board"
import rook from "@modules/base/figure/figures/rook"
/**refactoring needed*/
class King extends Figure {
  isCheck: boolean = false
  public canCastle: boolean = true
  constructor(color: "white" | "black", position: Position, board: Board) {
    super("king", color, position, board)
  }
  isValidMove(target: Position): boolean {
    //cel tego ifa to zapobieganie sytuacji gdzie sprawdzamy pozycje dla sojuszniczej figury. Wyjątkiem jest oczywiście rook- wieża, dla której stosujemy roszadę
    if (!(target?.figure instanceof Rook) && target.figure?.color === this.color) {
      return false
    }
    //do roszady
    if (Math.abs(this.position.x - target.x) === 2) {
      return this.findRook(target)
    }
    //jeśli target to rook to do roszady
    if (target.figure instanceof Rook && target.figure.color === this.color && target.figure.canCastle) {
      return this.findRook(target)
    }
    //standard movement
    if (Math.abs(target.x - this.position.x) <= 1 && Math.abs(target.y - this.position.y) <= 1) {
      return !(target.figure && target.figure.color === this.color)
    }
    return false
  }
  /**@todo a lot of testing for this shitty fucking code*/
  private castleMove(target: Position): boolean {
    if (!this.isValidMove(target)) {
      return false
    }
    //allows castling when clicked on friendly rook. newtargetX is position 2 fiels closer to the chosen position, so the castling works as intended (it should)
    if (target.figure instanceof Rook && target.figure.color === this.color && target.figure.canCastle) {
      const newTargetX = target.x - this.position.x
      const castleTarget = this._board.getPositionByCords(newTargetX, this.position.y)

      if (castleTarget) {
        return this.move(castleTarget)
      } else return false
      //allows castling when clicked on the field that is valid and is 2 spaces either to the right or left closer to the castled rook
    } else if (Math.abs(target.x - this.position.x) === 2 && this.canCastle) {
      const leftX = this._board.getPositionByCords(0, this.position.y)
      const rightX = this._board.getPositionByCords(7, this.position.y)
      if (leftX && leftX.figure instanceof Rook && leftX.figure.color === this.color && leftX.figure.canCastle) {
        return this.move(target)
      } else if (rightX && rightX.figure instanceof Rook && rightX.figure.color === this.color && rightX.figure.canCastle) {
        return this.move(target)
      }
    }
    return false
  }
  /**@todo a lot of more testing for even more shitty implementation of this fucking crap-code*/
  override move(target: Position): boolean {
    if (Math.abs(this.position.x - target.x) > 1) {
      return this.castleMove(target)
    }
    return super.move(target)
  }
  /**
   * The point of this method is to find rook in the same line as king.
   * If it detects any other figure on the way - the collision is detected and castling is impossible
   * @todo same here: test this piece of gównokołd because i give no warranty of it working
   * */
  private findRook(target: Position): boolean {
    const deltaX = target.x - this.position.x
    if (deltaX === 0) {
      return false
    }
    if (target.y !== this.position.y) {
      return false
    }
    const signX = deltaX > 0 ? 1 : -1
    let currentX = target.x - signX
    while (currentX !== this.position.x) {
      if (currentX > 7 || currentX < 0) {
        return false
      }
      const currentPosition = this._board.getPositionByCords(currentX, this.position.y)
      if (!currentPosition) {
        return false
      }
      if (currentPosition.figure instanceof Rook && currentPosition.figure.color === this.color) {
        return true
      }
      if (currentPosition.figure) {
        return false
      }
      currentX += signX
    }

    return false
  }
}

export default King
