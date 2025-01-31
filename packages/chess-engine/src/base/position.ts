import Figure from "./figure/figure"
import Board from "./board/board"
import figure from "./figure/figure"
import board from "./board/board"

/**
 * Class for a single cell position on chessBoard. Very important<br>
 * This method is being imported by each figure and chessBoard, please be considerate when altering something here.<br>
 * This class has methods to generate pgn chess notation, and to track if a figure is standing on itself.
 * It also has an id number corresponding to the place on chessboard. This class tracks its position with x and y coordinates on the chess board.
 * */
class Position {
  private _x: number // Współrzędne x (0-7 dla szachownicy)
  private _y: number // Współrzędne y (0-7 dla szachownicy)
  private _notation: string // Notacja szachowa, np. "e8", "a2"
  private _figure: Figure | null // Figura na pozycji, lub null jeśli brak figury
  private _id: number //id na szachownicy
  private _board: Board //do niektórych checków dla figur potrzebuje szachownicy więc sobie ją przekazuje tutaj tędy

  constructor(x: number, y: number, figure: Figure | null = null, id: number = 0, board: Board) {
    this._x = x
    this._y = y
    this._figure = figure
    this._notation = this.calculateNotation(x, y)
    this._id = id
    this._board = board
  }

  // Getter i setter dla x
  get x(): number {
    return this._x
  }

  set x(value: number) {
    this._x = value
    this._notation = this.calculateNotation(value, this._y)
  }

  // Getter i setter dla y
  get y(): number {
    return this._y
  }

  set y(value: number) {
    this._y = value
    this._notation = this.calculateNotation(this._x, value)
  }

  // Getter dla notacji szachowej
  get notation(): string {
    return this._notation
  }

  // Getter i setter dla figury
  get figure(): Figure | null {
    return this._figure
  }
  set figure(value: Figure | null) {
    this._figure = value
  }

  get id(): number {
    return this._id
  }
  get board(): Board {
    return this._board
  }

  // Prywatna metoda do obliczania notacji szachowej na podstawie współrzędnych
  private calculateNotation(x: number, y: number): string {
    const letters: any = "abcdefgh" // Y cords
    const rows = "12345678" // X cords
    if (x < 0 || x > 7 || y < 0 || y > 7) {
      throw new Error("Współrzędne muszą być w zakresie od 0 do 7.")
    }
    return letters[x] + rows[7 - y]
  }
}

export default Position
