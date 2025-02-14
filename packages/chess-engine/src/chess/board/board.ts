import { Bishop, Figure, King, Knight, Pawn, Queen, Rook } from "@utils/figureUtils"
import { Position } from "@utils/boardUtils"
import colorType from "@chesstypes/colorType"
import Move from "@chesstypes/moveType"

class Board {
  private positions: Map<string, Position>
  private letters: string = "abcdefgh"
  _whiteFigures: Figure[] = []
  _blackFigures: Figure[] = []
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

    const figure = this.getFigureAtPosition(fromPos)
    if (!figure) {
      console.error("Invalid move: No figure at the starting position", move.from)
      return false
    }

    if (!figure.isMoveValid(toPos)) {
      console.error("Invalid move: Move is not valid for this figure", { from: move.from, to: move.to })
      return false
    }

    // If there is a piece at the destination, remove it
    if (toPos.figure) {
      console.log(`Captured: ${toPos.figure.type} at ${toPos.notation}`)
      toPos.figure = null
    }

    // Update figure's position
    figure.position = toPos

    // Update board references
    fromPos.figure = null
    toPos.figure = figure

    if (figure instanceof Pawn) {
      figure.isFirstMove = false
    }
    if (figure instanceof Pawn && Math.abs(move.from.y - move.to.y) === 2) {
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

  /**
   * returns an array of positions, on which a move is possible to be made from given position
   * debug: shows in console a chessboard with possible moves
   * */
  public getValidMovesForPosition(position: Position): Position[] {
    const validMoves: Position[] = []
    console.debug("\nValidating moves for position: ", position.notation)
    console.debug(`\nFigure: ${position.figure?.type} \nof color: ${position.figure?.color} \nat ${position.notation} \nnoted as [o]`)
    for (let y = 0; y < 8; y++) {
      let row = ""
      for (let x = 0; x < 8; x++) {
        const letter = this.letters[x]
        if (!letter) {
          console.error(`Invalid letter index: ${x}`)
          break
        }
        const targetPosition = this.getPositionByNotation(letter + (8 - y))
        if (!targetPosition) {
          row += "[null]"
          break
        }
        if (targetPosition === position) {
          row += "[&&] " //starting pos
        } else if (position.figure?.isMoveValid(targetPosition)) {
          row += "[--] " //valid
          validMoves.push(targetPosition)
        } else {
          row += `[${targetPosition.notation}] ` //invalid
        }
      }
      console.debug(row.trim())
    }
    return validMoves
  }

  public getWhiteKing(): Figure | null {
    for (const figure of this._whiteFigures) {
      if (figure instanceof King) {
        return figure
      }
    }
    return null
  }
  public getBlackKing(): Figure | null {
    for (const figure of this.blackFigures) {
      if (figure instanceof King) {
        return figure
      }
    }
    return null
  }

  public isKingInCheck(color: colorType.White | colorType.Black): boolean {
    const king = color === colorType.White ? this.getWhiteKing() : this.getBlackKing()
    if (!king) return false // King should always exist

    const enemyFigures = color === colorType.White ? this._blackFigures : this._whiteFigures

    for (const figure of enemyFigures) {
      if (figure.isMoveValid(king.position)) {
        return true // Enemy can attack the king
      }
    }
    return false
  }
  public canKingEscape(color: colorType.White | colorType.Black): boolean {
    const king = color === colorType.White ? this.getWhiteKing() : this.getBlackKing()
    if (!king) return false

    const possibleMoves = [
      { dx: -1, dy: -1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 1 },
      { dx: 0, dy: 1 },
      { dx: 1, dy: 1 },
    ]

    for (const move of possibleMoves) {
      const target = this.getPositionByCords(king.position.x + move.dx, king.position.y + move.dy)
      if (target && (!target.figure || target.figure.color !== king.color)) {
        const originalPosition = king.position
        king.position = target // Simulate move
        const stillInCheck = this.isKingInCheck(color)
        king.position = originalPosition // Revert move

        if (!stillInCheck) {
          return true // King has at least one escape
        }
      }
    }
    return false
  }
  public canBlockOrCaptureAttacker(color: colorType.White | colorType.Black): boolean {
    const king = color === colorType.White ? this.getWhiteKing() : this.getBlackKing()
    if (!king) return false

    const enemyFigures = color === colorType.White ? this._blackFigures : this._whiteFigures
    const allies = color === colorType.White ? this._whiteFigures : this._blackFigures
    let attackers: Figure[] = []

    // Find all attacking pieces
    for (const figure of enemyFigures) {
      if (figure.isMoveValid(king.position)) {
        attackers.push(figure)
      }
    }

    if (attackers.length > 1) return false // Double check - only the king can move

    const attacker = attackers[0] // Only one attacker (not double check)

    // 1️⃣ **Check if an ally can capture the attacker**
    if (!attacker) return false
    for (const ally of allies) {
      if (ally.isMoveValid(attacker.position)) {
        return true
      }
    }

    // 2️⃣ **Check if an ally can block the attack**
    if (attacker instanceof Knight || attacker instanceof Pawn) return false // Cannot be blocked

    const deltaX = Math.sign(attacker.position.x - king.position.x)
    const deltaY = Math.sign(attacker.position.y - king.position.y)
    let currentX = king.position.x + deltaX
    let currentY = king.position.y + deltaY

    while (currentX !== attacker.position.x || currentY !== attacker.position.y) {
      const blockPosition = this.getPositionByCords(currentX, currentY)
      if (!blockPosition) return false

      for (const ally of allies) {
        if (ally.isMoveValid(blockPosition)) {
          return true // An ally can move to block
        }
      }

      currentX += deltaX
      currentY += deltaY
    }

    return false
  }
  public isCheckmate(color: colorType.White | colorType.Black): boolean {
    if (!this.isKingInCheck(color)) return false // King must be in check
    if (this.canKingEscape(color)) return false // King has an escape
    if (this.canBlockOrCaptureAttacker(color)) return false // Can block or capture attacker

    return true // No way to escape = Checkmate
  }
  public isStalemate(color: colorType.White | colorType.Black): boolean {
    if (this.isKingInCheck(color)) return false // Not checkmate, but no legal moves
    const pieces = color === colorType.White ? this._whiteFigures : this._blackFigures

    for (const piece of pieces) {
      const possibleMoves = this.getValidMovesForPosition(piece.position)
      if (possibleMoves.length > 0) return false // At least one legal move exists
    }

    return true // No legal moves = Stalemate
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

  public printBoard() {
    console.debug("\nPrinting chessboard with notations: \n")

    for (let y = 0; y < 8; y++) {
      let row = ""
      for (let x = 0; x < 8; x++) {
        const letter = this.letters[x]
        if (!letter) {
          console.error(`Invalid letter index: ${x}`)
          continue
        }
        const notation = letter + (8 - y)
        const position = this.positions.get(notation)
        row += position ? `[${position.notation}] ` : `[ undfd ] `
      }
      console.debug(row.trim())
    }
  }
  // Wyświetlenie szachownicy z figurami DEBUG
  public printFigures() {
    console.debug("\n \nPrinting chessboard by figures: \n")
    for (let y = 0; y < 8; y++) {
      let row = ""
      for (let x = 0; x < 8; x++) {
        const letter = this.letters[x]
        if (!letter) {
          console.error(`Invalid letter index: ${x}`)
          break
        }
        const figure = this.positions.get(letter + (8 - y))?.figure?.type
        if (figure === undefined) {
          row += `[-] `
          continue
        }
        if (figure === "knight") {
          row += "[" + figure?.charAt(1) + "] " //since King and Knight have the same first letter, in english chess notation the King is K and a Knight is N
          continue
        }
        row += "[" + figure?.charAt(0) + "] "
      }
      console.debug(row.trim())
    }
  }
  public printIds() {
    console.debug("\n \nPrinting chessboard by ids: \n")
    for (let y = 0; y < 8; y++) {
      let row = ""
      for (let x = 0; x < 8; x++) {
        const letter = this.letters[x]
        if (!letter) {
          console.error(`Invalid letter index: ${x}`)
          break
        }
        const id = this.positions.get(letter + (8 - y))?.id
        row += `[${id !== undefined ? id : " undfd "}] `
      }
      console.debug(row.trim())
    }
  }
  public printCords() {
    console.debug("\n \nPrinting chessboard by cords: \n")
    for (let y = 0; y < 8; y++) {
      let row = ""
      for (let x = 0; x < 8; x++) {
        const letter = this.letters[x]
        if (!letter) {
          console.error(`Invalid letter index: ${x}`)
          break
        }
        const currentPos = this.positions.get(letter + (8 - y))
        if (currentPos === undefined) {
          console.log("undefined!!!")
          continue
        }
        const cordsY = currentPos.y
        const cordsX = currentPos.x
        row += `[${cordsX}, ${cordsY}] `
        // row += `[${id !== undefined ? id : " undfd "}] `
      }
      console.debug(row.trim())
    }
  }
}
export default Board
