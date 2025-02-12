import { Bishop, Figure, King, Knight, Pawn, Queen, Rook } from "@modules/utils/figures"
import { Position } from "@modules/utils/board"
import { getValidPositions } from "@modules/shared/moveFunctions/moveValidation"

/**
 * Main playing board. very important.<br>
 * Class imports all figures and position.
 * The board consists of 64 individual Positions, which are stored in a "positions" Map.
 * Figures are stored in an array with preallocated 32 indexes, each for one figure
 * constructor only creates a map and allocates memory for arrays.
 * in order to actually create positions, call method setupBoard()
 * */
class Board {
  private positions: Map<string, Position>
  private letters: string = "abcdefgh"
  figures: (Figure | null)[] = []
  private blackFigures: Figure[] = []
  private whiteFigures: Figure[] = []
  private positionsById: Position[] = []

  constructor() {
    this.positions = new Map()
    // this.figures = Array(32)
  }
  /**
   * Sets up 64 positions in a twodimensional space of 8 height and 8 width. <br>*/
  public setupBoard() {
    let id = 0

    // To jest moj kod {matique}
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
  }
  // Wstawianie figur na szachownicę w standardowej pozycji
  public setupFigures() {
    // Białe figury (White pieces)
    for (let i = 0; i < 8; i++) {
      const position = this.positions.get(this.letters[i] + "2")
      if (position) {
        this.addFigureAtPosition(position, new Pawn("white", position, this)) // Pass "this" as board
      }
    }
    this.addFigureAtPosition(this.positions.get("a1")!, new Rook("white", this.positions.get("a1")!, this))
    this.addFigureAtPosition(this.positions.get("h1")!, new Rook("white", this.positions.get("h1")!, this))
    this.addFigureAtPosition(this.positions.get("b1")!, new Knight("white", this.positions.get("b1")!, this))
    this.addFigureAtPosition(this.positions.get("g1")!, new Knight("white", this.positions.get("g1")!, this))
    this.addFigureAtPosition(this.positions.get("c1")!, new Bishop("white", this.positions.get("c1")!, this))
    this.addFigureAtPosition(this.positions.get("f1")!, new Bishop("white", this.positions.get("f1")!, this))
    this.addFigureAtPosition(this.positions.get("d1")!, new Queen("white", this.positions.get("d1")!, this))
    this.addFigureAtPosition(this.positions.get("e1")!, new King("white", this.positions.get("e1")!, this))

    // Czarne figury (Black pieces)
    for (let i = 0; i < 8; i++) {
      const position = this.positions.get(this.letters[i] + "7")
      if (position) {
        this.addFigureAtPosition(position, new Pawn("black", position, this)) // Pass "this" as board
      }
    }
    this.addFigureAtPosition(this.positions.get("a8")!, new Rook("black", this.positions.get("a8")!, this))
    this.addFigureAtPosition(this.positions.get("h8")!, new Rook("black", this.positions.get("h8")!, this))
    this.addFigureAtPosition(this.positions.get("b8")!, new Knight("black", this.positions.get("b8")!, this))
    this.addFigureAtPosition(this.positions.get("g8")!, new Knight("black", this.positions.get("g8")!, this))
    this.addFigureAtPosition(this.positions.get("c8")!, new Bishop("black", this.positions.get("c8")!, this))
    this.addFigureAtPosition(this.positions.get("f8")!, new Bishop("black", this.positions.get("f8")!, this))
    this.addFigureAtPosition(this.positions.get("d8")!, new Queen("black", this.positions.get("d8")!, this))
    this.addFigureAtPosition(this.positions.get("e8")!, new King("black", this.positions.get("e8")!, this))

    console.log("Figures placed on the board.")
    console.log(this.figures)
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
        } else if (position.figure?.isValidMove(targetPosition)) {
          row += "[--] " //valid
          validMoves.push(targetPosition)
          //to be refactored
          // if (targetPosition?.figure?.type === "king" && targetPosition.figure?.color !== position.figure?.color) {
          //   ;(targetPosition.figure as King).isCheck = true
          // }
        } else {
          row += `[${targetPosition.notation}] ` //invalid
        }
      }
      // console.debug(row.trim())
    }
    return validMoves
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

  public getFigureAtPosition(position: Position): Figure | null {
    return position.figure
  }
  /***
   * returns true if succesfully placed a figure on board
   * @debug*/
  public addFigureAtPosition(position: Position, figure: Figure): boolean {
    const existingPosition = this.positions.get(position.notation)

    if (!existingPosition) {
      console.error(`Position "${position.notation}" does not exist on the board.`)
      return false
    }
    if (existingPosition.figure === null) {
      existingPosition.figure = figure
      console.log(`New figure added: ${figure.type} of colour: ${figure.color} at position ${figure.position.notation}`)
      figure.id = this.figures.length
      this.figures.push(figure)
      return true
    }
    console.warn(`Position "${position.notation}" already has a figure.`)
    return false
  }

  public moveFigureToPosition(move: { from: Position; to: Position }): boolean {
    if (!move.from.figure) return false

    return move.from.figure.move(move.to)
  }

  public clearPosition(position: Position): boolean {
    if (position.figure && position.figure.id !== undefined) {
      this.figures[position.figure.id] = null
      position.figure = null
      return true
    }
    return false
  }

  public getKingPosition(color: "white" | "black"): Position {
    for (const figure in this.figures) {
      if (this.figures[figure] instanceof King && this.figures[figure]?.color === color) {
        return this.figures[figure]?.position
      }
    }
    console.error("No king found")
    throw new Error("No king found")
  }
  //prosze zostawić ten kod dopoki mateusz nie przypomni sobie na chuj go przenosił do chessEngine
  // public updateProperties() {
  //   ;(this.getFigureAtPosition(this.getKingPosition("white")) as King).isCheck = false
  //   ;(this.getFigureAtPosition(this.getKingPosition("black")) as King).isCheck = false
  //
  //   for (let i = 0; i < this.figures.length; i++) {
  //     if (this.figures[i] === null) continue
  //     if (this.figures[i] instanceof Pawn) {
  //       ;(this.figures[i] as Pawn).isEnPassantPossible = false
  //     }
  //     if (this.figures[i]?.isValidMove(this.getKingPosition("white")) && this.figures[i]?.color === "black") {
  //       ;(this.getFigureAtPosition(this.getKingPosition("white")) as King).isCheck = true
  //       if (this.getValidMovesForPosition(this.getKingPosition("white")).length <= 0) {
  //       }
  //     }
  //     if (this.figures[i]?.isValidMove(this.getKingPosition("black")) && this.figures[i]?.color === "white") {
  //       for (const pos in this.getValidMovesForPosition(this.getKingPosition("black"))) {
  //         if (pos.length < 1) {
  //           console.log("CHECKMATE")
  //         }
  //       }
  //       ;(this.getFigureAtPosition(this.getKingPosition("black")) as King).isCheck = true
  //     }
  //   }
  // }
}
export default Board
