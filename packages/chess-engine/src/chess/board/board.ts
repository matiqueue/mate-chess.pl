import { Figure, King, Pawn, Rook } from "@utils/figureUtils"
import { Position } from "@utils/boardUtils"
import { color } from "@shared/types/colorType"
import { Move } from "@shared/types/moveType"
import { figureType } from "@shared/types/figureType"
import MoveRecord from "@shared/types/moveRecord"

class Board {
  private positions: Map<string, Position>
  private letters: string = "abcdefgh"
  _whiteFigures: Figure[] = []
  _blackFigures: Figure[] = []
  private _allFigures: Figure[] = []
  private positionsById: Position[] = []
  private _moveHistory: MoveRecord[] = []
  private _redoStack: MoveRecord[] = []

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
    if (figure.color === color.White) {
      this._whiteFigures.push(figure)
    } else if (figure.color === color.Black) {
      this._blackFigures.push(figure)
    }
    this.updateArray()
    // console.log(`Figure of id ${figure.id}, type: ${figure.type} and color: ${figure.color} was added at position: ${existingPos.notation}`)
    return true
  }

  public getFigureAtPosition(position: Position): Figure | null {
    return position.figure
  }

  public moveFigure(move: Move, simulate: boolean = false): boolean {
    const fromPos = this.getPosition(move.from)
    const toPos = this.getPosition(move.to)

    if (!fromPos || !toPos) {
      return false
    }

    const figure = this.getFigureAtPosition(fromPos)
    if (!figure) {
      return false
    }

    if (!simulate) {
      const legalMoves = this.getLegalMoves(figure.color)
      const isLegal = legalMoves.some((legalMove) => legalMove.from.notation === fromPos.notation && legalMove.to.notation === toPos.notation)

      if (!isLegal) {
        return false
      }
    }
    let wasFirstMove = false
    if (fromPos.figure instanceof Pawn) {
      wasFirstMove = fromPos.figure.isFirstMove
    } else if (fromPos.figure instanceof King || fromPos.figure instanceof Rook) {
      wasFirstMove = !fromPos.figure.hasMoved
    }
    const performingfigure = fromPos.figure
    if (!performingfigure) throw new Error("No figure performing the move")
    this._moveHistory.push(new MoveRecord(move, performingfigure, toPos.figure, wasFirstMove))

    if (toPos.figure) {
      console.log(`Captured: ${toPos.figure.type} at ${toPos.notation}`)
      toPos.figure = null
    }

    figure.position = toPos
    fromPos.figure = null
    toPos.figure = figure

    if (figure instanceof Pawn) {
      figure.isFirstMove = false
      if (Math.abs(move.from.y - move.to.y) === 2) {
        figure.isEnPassantPossible = true
      }
    }
    if (figure instanceof King) {
      figure.hasMoved = true
    }
    if (figure instanceof Rook) {
      figure.hasMoved = true
    }
    return true
  }

  public undoLastMove(): boolean {
    if (this._moveHistory.length === 0) return false
    if (!this._moveHistory) return false

    const lastMove = this._moveHistory[this._moveHistory.length - 1]
    if (!lastMove) return false

    const beforePosition = this.getPosition(lastMove.move.from)
    const afterPosition = this.getPosition(lastMove.move.to)
    const capturedFigure = lastMove.figureCaptured
    if (!beforePosition || !afterPosition) throw new Error("Critical error: no position")

    const figureToUndo = this.getFigureAtPosition(lastMove.move.to)
    if (!figureToUndo) throw new Error("Critical error: no figure found to undo")
    figureToUndo.position = beforePosition
    beforePosition.figure = figureToUndo

    if (figureToUndo instanceof Pawn) {
      figureToUndo.isFirstMove = lastMove.wasFirstMove
    } else if (figureToUndo instanceof King || figureToUndo instanceof Rook) {
      figureToUndo.hasMoved = !lastMove.wasFirstMove
    }

    if (capturedFigure) {
      afterPosition.figure = capturedFigure
      capturedFigure.position = afterPosition
    } else {
      afterPosition.figure = null
    }
    this._moveHistory.pop()
    return true
  }
  //===================================== AI GENERATED CODE BELOW =====================================
  //IT IS TOTALLY UNTESTED. I AM NOT RESPONSIBILE FOR WHETHER IT WORKS OR NOT.

  public rewindMove(): boolean {
    if (this._moveHistory.length === 0) return false

    const lastMove = this._moveHistory.pop()
    if (!lastMove) return false

    const beforePosition = this.getPosition(lastMove.move.from)
    const afterPosition = this.getPosition(lastMove.move.to)
    const capturedFigure = lastMove.figureCaptured

    if (!beforePosition || !afterPosition) throw new Error("Critical error: no position")

    const figureToUndo = this.getFigureAtPosition(lastMove.move.to)
    if (!figureToUndo) throw new Error("Critical error: no figure found to undo")

    // Move figure back
    figureToUndo.position = beforePosition
    beforePosition.figure = figureToUndo

    // Restore first move status
    if (figureToUndo instanceof Pawn) {
      figureToUndo.isFirstMove = lastMove.wasFirstMove
    } else if (figureToUndo instanceof King || figureToUndo instanceof Rook) {
      figureToUndo.hasMoved = !lastMove.wasFirstMove
    }

    // Restore captured figure
    if (capturedFigure) {
      afterPosition.figure = capturedFigure
      capturedFigure.position = afterPosition
    } else {
      afterPosition.figure = null
    }

    // Store move in redo stack for forwardMove
    this._redoStack.push(lastMove)

    return true
  }
  public forwardMove(): boolean {
    if (this._redoStack.length === 0) return false

    const moveRecord = this._redoStack.pop()
    if (!moveRecord) return false

    const move = moveRecord.move
    const fromPos = this.getPosition(move.from)
    const toPos = this.getPosition(move.to)
    if (!fromPos || !toPos) return false

    const figure = this.getFigureAtPosition(fromPos)
    if (!figure) return false

    // Apply move again
    toPos.figure = figure
    fromPos.figure = null
    figure.position = toPos

    // Restore captured figure if it was captured
    if (moveRecord.figureCaptured) {
      toPos.figure = moveRecord.figureCaptured
      moveRecord.figureCaptured.position = toPos
    }

    this._moveHistory.push(moveRecord)
    return true
  }

  //===================================== AI GENERATED ENDS HERE =====================================
  public canCastle(king: King, target: Position): boolean {
    if (king.hasMoved) return false

    const y = king.color === color.White ? 0 : 7
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
    const opponentFigures = king.color === color.White ? this._blackFigures : this._whiteFigures
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
   *
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
      // console.debug(row.trim())
    }
    return validMoves
  }
  // public getValidMovesForPosition(position: Position): Position[] {
  //   const validMoves: Position[] = []
  //   const figure = position.figure
  //   if (!figure) return validMoves
  //
  //   console.debug("\nValidating moves for position:", position.notation)
  //   console.debug(`\nFigure: ${figure.type} \nof color: ${figure.color} \nat ${position.notation} \nnoted as [o]`)
  //
  //   const x = position.x
  //   const y = position.y
  //
  //   switch (figure.type) {
  //     case figureType.pawn: {
  //       const direction = figure.color === color.White ? -1 : 1
  //
  //       // Normal move forward
  //       const oneStep = this.getPositionByCords(x, y + direction)
  //       if (oneStep && !oneStep.figure) validMoves.push(oneStep)
  //
  //       // Two steps forward if first move
  //       if ((figure as Pawn).isFirstMove) {
  //         const twoSteps = this.getPositionByCords(x, y + 2 * direction)
  //         if (twoSteps && !twoSteps.figure && oneStep) validMoves.push(twoSteps)
  //       }
  //
  //       // Diagonal capture
  //       ;[-1, 1].forEach((side) => {
  //         const diag = this.getPositionByCords(x + side, y + direction)
  //         if (diag && diag.figure && diag.figure.color !== figure.color) validMoves.push(diag)
  //       })
  //
  //       break
  //     }
  //
  //     case figureType.rook: {
  //       for (let i = -7; i <= 7; i++) {
  //         if (i === 0) continue
  //         const horizontal = this.getPositionByCords(x + i, y)
  //         const vertical = this.getPositionByCords(x, y + i)
  //
  //         if (horizontal) {
  //           if (horizontal.figure) {
  //             if (horizontal.figure.color !== figure.color) validMoves.push(horizontal)
  //             break
  //           }
  //           validMoves.push(horizontal)
  //         }
  //
  //         if (vertical) {
  //           if (vertical.figure) {
  //             if (vertical.figure.color !== figure.color) validMoves.push(vertical)
  //             break
  //           }
  //           validMoves.push(vertical)
  //         }
  //       }
  //       break
  //     }
  //
  //     case figureType.bishop: {
  //       for (let i = -7; i <= 7; i++) {
  //         if (i === 0) continue
  //         const diag1 = this.getPositionByCords(x + i, y + i)
  //         const diag2 = this.getPositionByCords(x - i, y + i)
  //
  //         if (diag1) {
  //           if (diag1.figure) {
  //             if (diag1.figure.color !== figure.color) validMoves.push(diag1)
  //             break
  //           }
  //           validMoves.push(diag1)
  //         }
  //
  //         if (diag2) {
  //           if (diag2.figure) {
  //             if (diag2.figure.color !== figure.color) validMoves.push(diag2)
  //             break
  //           }
  //           validMoves.push(diag2)
  //         }
  //       }
  //       break
  //     }
  //
  //     case figureType.queen: {
  //       // Rook + Bishop moves combined
  //       for (let i = -7; i <= 7; i++) {
  //         if (i === 0) continue
  //         const horizontal = this.getPositionByCords(x + i, y)
  //         const vertical = this.getPositionByCords(x, y + i)
  //         const diag1 = this.getPositionByCords(x + i, y + i)
  //         const diag2 = this.getPositionByCords(x - i, y + i)
  //
  //         if (horizontal) {
  //           if (horizontal.figure) {
  //             if (horizontal.figure.color !== figure.color) validMoves.push(horizontal)
  //             break
  //           }
  //           validMoves.push(horizontal)
  //         }
  //
  //         if (vertical) {
  //           if (vertical.figure) {
  //             if (vertical.figure.color !== figure.color) validMoves.push(vertical)
  //             break
  //           }
  //           validMoves.push(vertical)
  //         }
  //
  //         if (diag1) {
  //           if (diag1.figure) {
  //             if (diag1.figure.color !== figure.color) validMoves.push(diag1)
  //             break
  //           }
  //           validMoves.push(diag1)
  //         }
  //
  //         if (diag2) {
  //           if (diag2.figure) {
  //             if (diag2.figure.color !== figure.color) validMoves.push(diag2)
  //             break
  //           }
  //           validMoves.push(diag2)
  //         }
  //       }
  //       break
  //     }
  //
  //     case figureType.knight: {
  //       const knightMoves = [
  //         [2, 1],
  //         [2, -1],
  //         [-2, 1],
  //         [-2, -1],
  //         [1, 2],
  //         [1, -2],
  //         [-1, 2],
  //         [-1, -2],
  //       ]
  //
  //       knightMoves.forEach(([dx, dy]) => {
  //         if (!dx || !dy) return
  //         const newPos = this.getPositionByCords(x + dx, y + dy)
  //         if (newPos && (!newPos.figure || newPos.figure.color !== figure.color)) {
  //           validMoves.push(newPos)
  //         }
  //       })
  //       break
  //     }
  //
  //     case figureType.king: {
  //       for (let dx = -1; dx <= 1; dx++) {
  //         for (let dy = -1; dy <= 1; dy++) {
  //           if (dx === 0 && dy === 0) continue
  //           const newPos = this.getPositionByCords(x + dx, y + dy)
  //           if (newPos && (!newPos.figure || newPos.figure.color !== figure.color)) {
  //             validMoves.push(newPos)
  //           }
  //         }
  //       }
  //       break
  //     }
  //   }
  //
  //   return validMoves
  // }

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

  public isKingInCheck(colorType: color.White | color.Black): boolean {
    const king = colorType === color.White ? this.getWhiteKing() : this.getBlackKing()
    const enemyFigures = colorType === color.White ? this._blackFigures : this._whiteFigures

    if (!king) return false

    for (const figure of enemyFigures) {
      // Zamiast wywoływać isLegalMove (które symuluje ruch i sprawdza króla)
      // sprawdzamy, czy dana figura może (pseudo)legalnie zaatakować pole króla.
      if (figure.isMoveValid(king.position)) {
        return true
      }
    }
    return false
  }
  public isCheckmate(): color.White | color.Black | false {
    if (this.getLegalMoves(color.White).length <= 0) {
      if (this.isKingInCheck(color.White)) return color.White
    }
    if (this.getLegalMoves(color.Black).length <= 0) {
      if (this.isKingInCheck(color.Black)) return color.Black
    }
    return false
  }
  public isStalemate(): boolean {
    if (this.getLegalMoves(color.White).length <= 0) {
      if (!this.isKingInCheck(color.White)) return true
    }
    if (this.getLegalMoves(color.Black).length <= 0) {
      if (!this.isKingInCheck(color.Black)) return true
    }
    return false
  }

  public isLegalMove(move: { from: Position; to: Position }): boolean {
    const king = move.from.figure?.color === color.White ? this.getWhiteKing() : this.getBlackKing()
    const figures = move.from.figure?.color === color.Black ? this._blackFigures : this._whiteFigures

    if (!king) return false
    if (!figures) return false

    if (this.moveFigure(move, true)) {
      if (!this.isKingInCheck(king.color)) {
        const position = this.getPosition(move.to)
        if (position) {
          this.undoLastMove()
          return true
        }
      }
    }

    return false
  }

  public getLegalMovesForPosition(from: Position) {
    const king = from.figure?.color === color.White ? this.getWhiteKing() : this.getBlackKing()
    const figures = from.figure?.color === color.Black ? this._blackFigures : this._whiteFigures
    const legalMoves: Position[] = []

    if (!king) return []
    if (!figures) return []

    const pseudoLegalMoves = this.getValidMovesForPosition(from)
    for (const moveToVerify of pseudoLegalMoves) {
      const move = {
        from: from,
        to: moveToVerify,
      }
      if (this.moveFigure(move, true)) {
        if (!this.isKingInCheck(king.color)) {
          const position = this.getPosition(moveToVerify)
          if (!position) continue
          legalMoves.push(position)
        }
        this.undoLastMove()
      }
    }
    return legalMoves
  }
  public getLegalMoves(colorType: color.White | color.Black): Move[] {
    const king = colorType === color.White ? this.getWhiteKing() : this.getBlackKing()
    const figures = colorType === color.Black ? this._blackFigures : this._whiteFigures
    const legalMoves: Move[] = []

    if (!king) return []
    if (!figures) return []

    for (const figure of figures) {
      const pseudoLegalMoves = this.getValidMovesForPosition(figure.position)

      for (const moveToVerify of pseudoLegalMoves) {
        const move = {
          from: figure.position,
          to: moveToVerify,
        }
        if (this.moveFigure(move, true)) {
          if (!this.isKingInCheck(king.color)) {
            legalMoves.push(move)
          }
          this.undoLastMove()
        }
      }
    }
    return legalMoves
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

  public getBoardArray(): [string[]] {
    let result: [string[]] = [[]]
    let rowArray: string[] = []
    for (const position of this.positions) {
      let symbol: string = ""
      switch (position[1].figure?.type) {
        case figureType.king:
          symbol = "k"
          break
        case figureType.pawn:
          symbol = "p"
          break
        case figureType.rook:
          symbol = "r"
          break
        case figureType.bishop:
          symbol = "b"
          break
        case figureType.knight:
          symbol = "n"
          break
        case figureType.queen:
          symbol = "q"
          break
        default:
          symbol = ""
          break
      }
      if (position[1].figure?.color === color.White) {
        symbol = symbol.toUpperCase()
      }
      rowArray.push(symbol)

      if ((position[1].id + 1) % 8 === 0) {
        result.push(rowArray)
        rowArray = []
      }
    }
    return result
  }
  get allFigures(): Figure[] {
    return this._allFigures
  }

  get moveHistory(): MoveRecord[] {
    return this._moveHistory
  }
}
export default Board
