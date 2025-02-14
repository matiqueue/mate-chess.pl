import { Bishop, Figure, King, Knight, Pawn, Queen, Rook } from "@utils/figureUtils"
import { Position } from "@utils/boardUtils"
import colorType from "@chesstypes/colorType"
import Move from "@chesstypes/moveType"

class Board {
  private positions: Map<string, Position>
  private letters: string = "abcdefgh"
  private _whiteFigures: Figure[] = []
  private _blackFigures: Figure[] = []
  private _allFigures: Figure[] = []
  private positionsById: Position[] = []

  constructor() {
    this.positions = new Map()
  }
  public setupBoard(): boolean {
    let id = 0

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const letter = this.letters[x]
        if (!letter) {
          console.error(`Invalid letter index: ${x}`)
          continue
        }
        const notation = letter + (8 - y)
        const position = new Position(x, y, null, id, this)
        this.positions.set(notation, position)
        this.positionsById[id] = position
        id++
      }
    }
    return this.positions.size === 64
  }

  public getPositionByNotation(notation: string): Position | null {
    const position = this.positions.get(notation)
    if (!position) {
      console.error(`Position "${notation}" does not exist on the board.`)
      process.kill(1)
      return null
    }
    return position
  }
  public getPosition(position: Position): Position | null {
    return this.getPositionByNotation(position.notation)
  }
  public getPositionById(id: number): Position | null {
    return this.positionsById[id] || null // Dostęp w O(1)
  }
  public getPositionByCords(positionX: number, positionY: number): Position | null {
    const posX = this.letters[positionX]
    if (!posX) {
      // console.error(`Position "${positionX}" does not exist on the board.`)
      return null
    }
    const notation = posX + (8 - positionY) // Adjust rank mapping
    return this.getPositionByNotation(notation)
  }

  public addFigureAtPosition(position: Position, figure: Figure): boolean {
    const existingPos = this.getPosition(position)
    if (!existingPos) return false
    if (existingPos.figure) return false

    existingPos.figure = figure
    figure.id = this._allFigures.length
    if (figure.color === colorType.White) {
      this._whiteFigures.push(figure)
    } else if (figure.color === colorType.Black) {
      this._blackFigures.push(figure)
    }
    this.updateArray()
    // console.log(`Figure of id ${figure.id}, type: ${figure.type} and color: ${figure.color} was added at position: ${existingPos.notation}`)
    return true
  }

  public getFigureAtPosition(position: Position): Figure | null {
    return position.figure
  }

  public moveFigure(move: Move): boolean {
    const fromPos = this.getPosition(move.from)
    const toPos = this.getPosition(move.to)

    if (!fromPos || !toPos) {
      console.error("Invalid move: One of the positions is null", { fromPos, toPos })
      return false
    }

    const figure = this.getFigureAtPosition(move.from)
    if (!figure) {
      console.error("Invalid move: No figure at the starting position", move.from)
      return false
    }
    if (!figure.isMoveValid(move.to)) {
      return false
    }

    fromPos.figure = null
    toPos.figure = figure
    figure.position = toPos

    if (figure instanceof Pawn) {
      figure.isEnPassantPossible = true
    }
    if (figure instanceof King) {
      figure.hasMoved = true
    }
    if (figure instanceof Rook) {
      figure.hasMoved = true
    }
    return true
  }
  public canCastle(king: King, target: Position): boolean {
    if (king.hasMoved) return false

    const y = king.color === colorType.White ? 0 : 7
    const isShortCastle = target.x > king.position.x
    const rookStartX = isShortCastle ? 7 : 0
    const rookEndX = isShortCastle ? 5 : 3

    const rookPos = this.getPositionByCords(rookStartX, y)
    const rook = rookPos?.figure

    if (!(rook instanceof Rook) || (rook as Rook).hasMoved) {
      return false
    }

    // Sprawdzenie, czy pola między królem a wieżą są puste
    const direction = isShortCastle ? 1 : -1
    for (let x = king.position.x + direction; x !== rookPos?.x; x += direction) {
      if (this.getPositionByCords(x, y)?.figure) {
        return false
      }
    }

    // Sprawdzenie, czy król nie przechodzi przez szachowane pole
    const opponentFigures = king.color === colorType.White ? this._blackFigures : this._whiteFigures
    for (let x = king.position.x; x !== target.x + direction; x += direction) {
      const testPosition = this.getPositionByCords(x, y)
      if (!testPosition) continue

      for (const opponentFigure of opponentFigures) {
        if (opponentFigure.isMoveValid(testPosition)) {
          return false
        }
      }
    }

    return true
  }

  private updateArray(): void {
    this._allFigures = this._whiteFigures.concat(this._blackFigures)
  }

  get whiteFigures(): Figure[] {
    return this._whiteFigures
  }

  get blackFigures(): Figure[] {
    return this._blackFigures
  }

  get allFigures(): Figure[] {
    return this._allFigures
  }
}
export default Board
