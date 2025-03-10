import { Board } from "@utils/boardUtils"
import { Figure } from "@utils//figureUtils"

/**
 * Class for a single cell position on chessBoard. Very important<br>
 * This method is being imported by each figure and chessBoard, please be considerate when altering something here.<br>
 * It provides methods for generating PGN chess notation and tracking if a figure is standing on itself.
 * The position is represented with x and y coordinates and an id corresponding to its place on the chessboard.
 * */
class Position {
  private _x: number // Współrzędne x (0-7 dla szachownicy)
  private _y: number // Współrzędne y (0-7 dla szachownicy)
  private _notation: string // Notacja szachowa, np. "e8", "a2"
  private _figure: Figure | null // Figura na pozycji, lub null jeśli brak figury
  private _id: number //id na szachownicy
  private _board: Board //do niektórych checków dla figur potrzebuje szachownicy więc sobie ją przekazuje tutaj tędy

  /**
   * @param x - The x-coordinate (0-7)
   * @param y - The y-coordinate (0-7)
   * @param figure - The figure occupying this position (optional, default: null)
   * @param id - The ID of the position on the chessboard (default: 0)
   * @param board - Reference to the chessboard
   */
  constructor(x: number, y: number, figure: Figure | null = null, id: number = 0, board: Board) {
    this._x = x
    this._y = y
    this._figure = figure
    this._notation = this.calculateNotation(x, y)
    this._id = id
    this._board = board
  }

  /**
   * Calculates the chess notation for given coordinates.
   * @param x - The x-coordinate (0-7)
   * @param y - The y-coordinate (0-7)
   * @returns The chess notation string (e.g., "e8", "a2").
   * @throws Error if the coordinates are out of range.
   */
  private calculateNotation(x: number, y: number): string {
    const letters: string = "abcdefgh" // Y cords
    const rows = "12345678" // X cords
    if (x < 0 || x > 7 || y < 0 || y > 7) {
      throw new Error("Coordinates out of range (0-7)")
    }
    if (letters[x] === undefined || rows[7 - y] === undefined) {
      throw new Error("undefined array indexes")
    }
    return letters[x] + rows[7 - y]
  }
  /** x-coordinate of the possition
   * @returns x coordinate in range 0 to 7 */
  get x(): number {
    return this._x
  }

  /**
   * Sets the x-coordinate and updates the notation.
   * @param value - X coordinate to be set
   */
  set x(value: number) {
    this._x = value
    this._notation = this.calculateNotation(value, this._y)
  }

  /** x-coordinate of the possition
   * @returns y coordinate in range 0 to 7 */
  get y(): number {
    return this._y
  }

  /**
   * Sets the y-coordinate and updates the notation.
   * @param value - Y coordinate to be set
   */
  set y(value: number) {
    this._y = value
    this._notation = this.calculateNotation(this._x, value)
  }

  /** @returns The chess notation of this position. */
  get notation(): string {
    return this._notation
  }

  /** The figure occupying this position, or null if empty.
   * @returns Figure | Null */
  get figure(): Figure | null {
    return this._figure
  }

  /**
   * Sets the figure on this position.<br>
   * Figure must be an instance of Figure<br>
   * set null when empty.
   * @param value - Figure | null
   */
  set figure(value: Figure | null) {
    this._figure = value
  }

  /**The unique ID of this position on the chessboard.
   * @returns id number, normally in range 0 to 63*/
  get id(): number {
    return this._id
  }

  /**The chessboard reference associated with this position.
   *  @returns Board reference */
  get board(): Board {
    return this._board
  }
}

export default Position
