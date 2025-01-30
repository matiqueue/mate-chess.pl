import Figure from "../figure"
import Position from "../../position"
import Board from "../../board/board"

class Pawn extends Figure {
  private _isFirstMove: boolean
  public isEnPassantPossible: boolean = true
  constructor(color: "white" | "black", position: Position, board: Board) {
    super("pawn", color, position, board)
    if (position.y === 6 || position.y === 1) {
      this._isFirstMove = true
    } else this._isFirstMove = false
  }

  isValidMove(target: Position): boolean {
    const leftPosition = this._board.getPositionByCords(this.position.x - 1, this.position.y)
    const rightPosition = this._board.getPositionByCords(this.position.x + 1, this.position.y)

    const leftFigure = leftPosition?.figure
    const rightFigure = rightPosition?.figure

    switch (this.color) {
      case "black":
        //standard fwd
        if (target.x === this.position.x && target.y === this.position.y + 1) {
          return true
        }
        //aggression
        if (target.figure && Math.abs(target.x - this.position.x) === 1 && target.y === this.position.y + 1) {
          return true
        }
        //first pawn move fwd
        if (this._isFirstMove && target.x === this.position.x && target.y === this.position.y + 2) {
          return true
        }
        //en passant below
        //podejście 1

        if (leftFigure instanceof Pawn && leftFigure.isEnPassantPossible) {
          if (target.x === this.position.x - 1 && target.y === this.position.y + 1) {
            return true
          }
        } else if (rightFigure instanceof Pawn && rightFigure.isEnPassantPossible) {
          if (target.x === this.position.x + 1 && target.y === this.position.y + 1) {
            return true
          }
        }
        //podejście 2 (nie będzie potrzebne thought)
        /*Musze sobie rozpisać co co mam tu zrobić
         * 1. Sprawdzam czy po lewo lub po prawo jest pion
         * 2. jeśli jest pion, sprawdź, czy ma flagę isEnPassantPossible
         * 3. jeśli tak, sprawdź czy target to pozycja 1 pole za pionem
         * 4. zaimplementuj lustrzane odbicie tego kodu dla białych
         * */
        return false
      case "white":
        //standard fwd
        if (target.x === this.position.x && target.y === this.position.y - 1) {
          return true
        }
        //standard attack
        if (target.figure && Math.abs(target.x - this.position.x) === 1 && target.y === this.position.y - 1) {
          return true
        }
        //first pawn move fwd
        if (this._isFirstMove && target.x === this.position.x && target.y === this.position.y - 2) {
          return true
        }
        //en passant below
        if (leftFigure instanceof Pawn && leftFigure.isEnPassantPossible) {
          if (target.x === this.position.x - 1 && target.y === this.position.y - 1) {
            // Biały pion porusza się "w górę"
            return true
          }
        } else if (rightFigure instanceof Pawn && rightFigure.isEnPassantPossible) {
          if (target.x === this.position.x + 1 && target.y === this.position.y - 1) {
            // Biały pion porusza się "w górę"
            return true
          }
        }
        return false
    }
  }

  override move(target: Position): boolean {
    if (this._isFirstMove) {
      this.isEnPassantPossible = true
      return super.move(target)
    }
    this._isFirstMove = false
    return super.move(target)
  }
}
export default Pawn
