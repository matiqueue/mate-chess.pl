import { color } from "@shared/types/colorType"
import { figureType } from "@shared/types/figureType"
import { Position, Board } from "@utils/boardUtils"

abstract class Figure {
  private _type: figureType
  private _color: color

  private _position: Position
  private _id: number = 0
  protected _board: Board

  constructor(type: figureType, color: color, position: Position, board: Board) {
    this._type = type
    this._color = color
    this._position = position
    this._board = board
  }

  protected isPositionExisting(target: Position): boolean {
    return !!this._board.getPositionByNotation(target.notation)
  }
  abstract isPositionValid(target: Position): boolean
  abstract isMoveValid(target: Position): boolean

  get position(): Position {
    return this._position
  }

  set position(value: Position) {
    this._position = value
  }

  get type(): figureType {
    return this._type
  }

  get color(): color {
    return this._color
  }

  set id(value: number) {
    this._id = value
  }

  get id(): number {
    return this._id
  }
}
export default Figure
