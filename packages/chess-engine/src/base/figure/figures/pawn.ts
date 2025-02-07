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
        if (target.x === this.position.x && target.y === this.position.y + 1 && !target.figure) {
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
        if (leftFigure instanceof Pawn && leftFigure.isEnPassantPossible && leftFigure.color !== this.color) {
          if (target.x === this.position.x - 1 && target.y === this.position.y + 1) {
            return true
          }
        } else if (rightFigure instanceof Pawn && rightFigure.isEnPassantPossible && rightFigure.color !== this.color) {
          if (target.x === this.position.x + 1 && target.y === this.position.y + 1) {
            return true
          }
        }
        return false
      case "white":
        //standard fwd
        if (target.x === this.position.x && target.y === this.position.y - 1 && !target.figure) {
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
        if (leftFigure instanceof Pawn && leftFigure.isEnPassantPossible && leftFigure.color !== this.color) {
          if (target.x === this.position.x - 1 && target.y === this.position.y - 1) {
            return true
          }
        } else if (rightFigure instanceof Pawn && rightFigure.isEnPassantPossible && rightFigure.color !== this.color) {
          if (target.x === this.position.x + 1 && target.y === this.position.y - 1) {
            return true
          }
        }
        return false
    }
  }

  override move(target: Position): boolean {
    if (this.isEnPassantValid(target)) {
      return this.enPassantMove(target)
    }
    if (this._isFirstMove) {
      this.isEnPassantPossible = true
    }
    if (super.move(target)) {
      this._isFirstMove = false
      return true
    }
    return false
  }
  public isEnPassantValid(target: Position): boolean {
    const leftPosition = this._board.getPositionByCords(this.position.x - 1, this.position.y)
    const rightPosition = this._board.getPositionByCords(this.position.x + 1, this.position.y)

    const leftFigure = leftPosition?.figure
    const rightFigure = rightPosition?.figure

    switch (this.color) {
      case "black":
        //en passant below
        if (leftFigure instanceof Pawn && leftFigure.isEnPassantPossible && leftFigure.color !== this.color) {
          if (target.x === this.position.x - 1 && target.y === this.position.y + 1) {
            return true
          }
        } else if (rightFigure instanceof Pawn && rightFigure.isEnPassantPossible && rightFigure.color !== this.color) {
          if (target.x === this.position.x + 1 && target.y === this.position.y + 1) {
            return true
          }
        }
        return false
      case "white":
        if (leftFigure instanceof Pawn && leftFigure.isEnPassantPossible && leftFigure.color !== this.color) {
          if (target.x === this.position.x - 1 && target.y === this.position.y - 1) {
            return true
          }
        } else if (rightFigure instanceof Pawn && rightFigure.isEnPassantPossible && rightFigure.color !== this.color) {
          if (target.x === this.position.x + 1 && target.y === this.position.y - 1) {
            return true
          }
        }
        return false
    }
  }
  public enPassantMove(target: Position): boolean {
    let leftPosition = this._board.getPositionByCords(this.position.x - 1, this.position.y)
    let rightPosition = this._board.getPositionByCords(this.position.x + 1, this.position.y)

    let leftFigure = leftPosition?.figure
    let rightFigure = rightPosition?.figure

    const isSucces = super.move(target)
    if (target.x === leftPosition?.x) {
      leftPosition.figure = null
    } else if (target.x === rightPosition?.x) {
      rightPosition.figure = null
    }
    return isSucces
  }
}
export default Pawn
