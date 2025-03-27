import { color } from "@shared/types/colorType"
import { figureType } from "@shared/types/figureType"
import { Position, Board } from "@utils/boardUtils"

/**
 * Abstract class representing a chess figure.
 * This class defines some basic shared properties and behaviors of a chess piece,
 * including its type, color, position, and universal movement validation methods.
 */
abstract class Figure {
  private _type: figureType
  private _color: color
  private _materialValue: number

  private _position: Position
  private _id: number = 0
  protected _board: Board
  protected pcsqt: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]

  /**
   * @param type - figure type. Use figureType enum
   * @param color - figure color. Use enum color
   * @param position - Position instance. Position of the figure
   * @param board - The chessboard reference.
   * @param materialValue - value of particular piece on the chessboard
   * @param pcsqt - table of bonuses for each of the posistions for the given piece
   */
  constructor(type: figureType, color: color, position: Position, board: Board, materialValue: number, pcsqt: number[][]) {
    this._type = type
    this._color = color
    this._position = position
    if (!this._position) {
      throw new Error(`${color} ${type} at: ${position.notation} cant find given position`)
    }
    this._board = board
    this._materialValue = materialValue
    this.pcsqt = pcsqt
  }

  /**
   * Checks if the input position exists on the chessboard. It is internal validation and universal null-check.
   * @param target - The target position to check.
   * @returns True if the position exists, false otherwise.
   */
  protected isPositionExisting(target: Position): boolean {
    return !!this._board.getPositionByNotation(target.notation)
  }
  /**
   * Determines if a target position is a valid possible destination for this figure.
   * @param target - The target position.
   * @returns True if the position is within a range of movement of given piece. It ignores collision check and such.
   */
  abstract isPositionValid(target: Position): boolean
  /**
   * Determines if a move to the target position is legal. Moves validated with this method are pseudolegal,
   * meaning they need further validation e.g to check for checkmate or any special moves
   * @param target - The target position.
   * @returns True if the move is valid, false otherwise.
   */
  abstract isMoveValid(target: Position): boolean

  /** Current position of the figure
   * @returns reference to position of the figure */
  get position(): Position {
    return this._position
  }

  /**
   * Sets a new position for the figure.
   * @param value - The new position.
   */
  set position(value: Position) {
    this._position = value
  }

  /** @returns The type of the figure. */
  get type(): figureType {
    return this._type
  }

  /** @returns The color of the figure. */
  get color(): color {
    return this._color
  }

  /**
   * Sets the unique identifier for the figure.
   * @param value - The new ID.
   */
  set id(value: number) {
    this._id = value
  }

  /** Unique id of the figure
   * @returns The unique identifier of the figure. */
  get id(): number {
    return this._id
  }
  /** Material value of given piece
   * @returns standard piece value multiplied by 100*/
  get materialValueWithBonus(): number {
    const x = this.position.x
    const y = this.position.y
    if (!this.position) throw new RangeError("position cannot be null")
    if (x === undefined || y === undefined || x === null || y === null) {
      console.error(`Critical Error: position x: ${x} y: ${y} does not exist for figure: ${this._color} ${this._type} at: ${this.position.notation}`)
      console.log(x)
      console.log(y)
      return this._materialValue
    }

    let bonus = 0
    switch (this._color) {
      case color.Black:
        const yn = 7 - this.position.y
        if (this.pcsqt[yn] && this.pcsqt[yn][x]) {
          bonus = this.pcsqt[yn][x]
        }
        break
      case color.White:
        if (this.pcsqt[y] && this.pcsqt[y][x]) {
          bonus = this.pcsqt[y][x]
        }
        break
    }

    return this._materialValue * bonus
  }
  get rawMaterialValue(): number {
    return this._materialValue
  }
}
export default Figure
