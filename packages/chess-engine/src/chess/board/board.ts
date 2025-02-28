import { Figure, King, Pawn, Rook } from "@utils/figureUtils"
import { Position } from "@utils/boardUtils"
import { color } from "@shared/types/colorType"
import { Move } from "@shared/types/moveType"
import { figureType } from "@shared/types/figureType"
import MoveRecord from "@shared/types/moveRecord"
import Bishop from "@modules/chess/figure/figures/bishop"
import Knight from "@modules/chess/figure/figures/knight"
import Queen from "@modules/chess/figure/figures/queen"

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
    let toPos = this.getPosition(move.to)

    if (!fromPos || !toPos) {
      return false
    }

    const figure = this.getFigureAtPosition(fromPos)
    if (!figure) {
      throw new Error("No figure performing the move")
    }

    if (!simulate) {
      const legalMoves = this.getLegalMoves(figure.color)
      const isLegal = legalMoves.some((legalMove) => legalMove.from.notation === fromPos.notation && legalMove.to.notation === toPos.notation)

      if (!isLegal) {
        return false
      }
    }
    let wasFirstMove = false
    if (fromPos.figure instanceof Pawn && fromPos.figure.isFirstMove) {
      wasFirstMove = true
    } else if ((fromPos.figure instanceof King || fromPos.figure instanceof Rook) && !fromPos.figure.hasMoved) {
      wasFirstMove = true
    }

    let capturedFigure = toPos.figure

    if (toPos.figure) {
      console.log(`Captured: ${toPos.figure.type} at ${toPos.notation}`)
      // Usuwamy referencję z pozycji – dalsze usunięcie z tablicy nastąpi poniżej
      toPos.figure = null
    }

    if (figure instanceof Pawn) {
      figure.isFirstMove = false

      // Jeśli ruch o dwa pola do przodu – oznacz en passant
      if (Math.abs(move.from.y - move.to.y) === 2 && move.from.x === move.to.x) {
        figure.isEnPassantPossible = true
      }
      // En passant
      if (Math.abs(move.from.x - move.to.x) === 1 && Math.abs(move.from.y - move.to.y) === 1 && !toPos.figure) {
        if (this.isMoveEnPassant(move)) {
          const { from, to } = move
          const performingFigure = this.getFigureAtPosition(from)
          if (!performingFigure) return false

          const leftPosition = this.getPositionByCords(from.x - 1, from.y)
          const rightPosition = this.getPositionByCords(from.x + 1, from.y)

          if (!leftPosition && !rightPosition) return false

          const leftFigure = leftPosition ? this.getFigureAtPosition(leftPosition) : null
          const rightFigure = rightPosition ? this.getFigureAtPosition(rightPosition) : null

          // Sprawdzamy lewą stronę en passant
          if (leftFigure instanceof Pawn && leftFigure.color !== performingFigure.color && leftFigure.isEnPassantPossible && to.x === from.x - 1) {
            capturedFigure = leftFigure
            leftPosition!.figure = null
            if (!simulate) {
              // Usuwamy zbity pionek z odpowiedniej tablicy
              if (capturedFigure.color === color.White) {
                this._whiteFigures = this._whiteFigures.filter((fig) => fig !== capturedFigure)
              } else {
                this._blackFigures = this._blackFigures.filter((fig) => fig !== capturedFigure)
              }
              this.updateArray()
            }
            figure.position = toPos
            fromPos.figure = null
            toPos.figure = figure

            this._moveHistory.push(new MoveRecord(move, performingFigure, capturedFigure, wasFirstMove, false, true))
            return true
          }
          // Sprawdzamy prawą stronę en passant
          else if (rightFigure instanceof Pawn && rightFigure.color !== performingFigure.color && rightFigure.isEnPassantPossible && to.x === from.x + 1) {
            capturedFigure = rightFigure
            rightPosition!.figure = null
            if (!simulate) {
              if (capturedFigure.color === color.White) {
                this._whiteFigures = this._whiteFigures.filter((fig) => fig !== capturedFigure)
              } else {
                this._blackFigures = this._blackFigures.filter((fig) => fig !== capturedFigure)
              }
              this.updateArray()
            }
            figure.position = toPos
            fromPos.figure = null
            toPos.figure = figure

            this._moveHistory.push(new MoveRecord(move, performingFigure, capturedFigure, wasFirstMove, false, true))
            return true
          }
        }
      }
    }
    if (figure instanceof King) {
      if (capturedFigure instanceof Rook && capturedFigure.color === figure.color) {
        if (!capturedFigure.hasMoved && !figure.hasMoved) {
          const deltaX = toPos.x - fromPos.x
          const signX = deltaX === 0 ? 0 : deltaX > 0 ? 1 : -1

          const newPosKing = this.getPositionByCords(fromPos.x + 2 * signX, toPos.y)
          const newPosRook = this.getPositionByCords(fromPos.x + signX, toPos.y)
          if (newPosKing && newPosRook) {
            figure.position = newPosKing
            fromPos.figure = null

            newPosKing.figure = figure
            newPosRook.figure = capturedFigure

            figure.hasMoved = true
            capturedFigure.hasMoved = true

            const kingMove = {
              from: fromPos,
              to: newPosKing,
            }
            this._moveHistory.push(new MoveRecord(kingMove, figure, null, wasFirstMove))

            const rookMove = {
              from: toPos,
              to: newPosRook,
            }
            this._moveHistory.push(new MoveRecord(rookMove, capturedFigure, null, wasFirstMove, true))
            return true
          } else throw new Error("Terrible error when getting castle position")
        }
      }

      figure.hasMoved = true
    }
    if (figure instanceof Rook) {
      figure.hasMoved = true
    }

    // Przy standardowym ruchu – jeśli nastąpiło bicie, usuń figurę z tablicy przeciwnika
    if (!simulate && capturedFigure && capturedFigure.color !== figure.color) {
      if (capturedFigure.color === color.White) {
        this._whiteFigures = this._whiteFigures.filter((fig) => fig !== capturedFigure)
      } else {
        this._blackFigures = this._blackFigures.filter((fig) => fig !== capturedFigure)
      }
      this.updateArray()
    }

    figure.position = toPos
    fromPos.figure = null
    toPos.figure = figure

    this._moveHistory.push(new MoveRecord(move, figure, capturedFigure, wasFirstMove))
    return true
  }

  public undoLastMove(): boolean {
    if (this._moveHistory.length === 0) return false

    const lastMove = this._moveHistory[this._moveHistory.length - 1]
    if (!lastMove) return false

    const beforePosition = this.getPosition(lastMove.move.from)
    const afterPosition = this.getPosition(lastMove.move.to)
    if (!beforePosition || !afterPosition) throw new Error("Critical error: no position")

    const figurePerforming = lastMove.figurePerforming
    if (!figurePerforming) throw new Error("Critical error: no performing figure")

    beforePosition.figure = figurePerforming
    figurePerforming.position = beforePosition
    afterPosition.figure = null

    if (figurePerforming instanceof Pawn) {
      figurePerforming.isFirstMove = lastMove.wasFirstMove
    } else if (figurePerforming instanceof Rook || figurePerforming instanceof King) {
      figurePerforming.hasMoved = !lastMove.wasFirstMove
    }

    const capturedFigure = lastMove.figureCaptured
    if (capturedFigure) {
      let capPos: Position | null
      if (lastMove.enPassant && capturedFigure instanceof Pawn) {
        capturedFigure.isEnPassantPossible = true
        // Dla en passant wyliczamy oryginalną pozycję zbitego pionka
        if (figurePerforming.color === color.White) {
          // Dla białego pionka – captured była poniżej pola docelowego
          capPos = this.getPositionByCords(lastMove.move.to.x, lastMove.move.to.y + 1)
        } else {
          // Dla czarnego pionka – captured była powyżej pola docelowego
          capPos = this.getPositionByCords(lastMove.move.to.x, lastMove.move.to.y - 1)
        }
      } else {
        // Standardowe zbicie – używamy pozycji zapisanej w obiekcie zbitej figury
        capPos = this.getPosition(capturedFigure.position)
      }
      if (!capPos) throw new Error("Critical error: no position for captured figure")
      capPos.figure = capturedFigure
      capturedFigure.position = capPos
    }
    this._moveHistory.pop()
    if (lastMove.castleMove) {
      this.undoLastMove()
    }
    return true
  }
  //===================================== AI GENERATED CODE BELOW =====================================
  //IT IS TOTALLY UNTESTED. I AM NOT RESPONSIBILE FOR WHETHER IT WORKS OR NOT.

  public rewindMove(): boolean {
    // Jeżeli nie ma ruchów w historii – nie cofniemy
    if (this._moveHistory.length === 0) return false

    // Pobieramy ostatni ruch z historii
    const lastMove = this._moveHistory.pop()
    if (!lastMove) return false

    const beforePosition = this.getPosition(lastMove.move.from)
    const afterPosition = this.getPosition(lastMove.move.to)
    if (!beforePosition || !afterPosition) throw new Error("Critical error: no position")

    const figurePerforming = lastMove.figurePerforming
    if (!figurePerforming) throw new Error("Critical error: no performing figure")

    // 1. Przesuwamy figurę z powrotem na pole startowe
    beforePosition.figure = figurePerforming
    figurePerforming.position = beforePosition
    afterPosition.figure = null

    // 2. Przywracamy status firstMove / hasMoved
    if (figurePerforming instanceof Pawn) {
      figurePerforming.isFirstMove = lastMove.wasFirstMove
    } else if (figurePerforming instanceof Rook || figurePerforming instanceof King) {
      figurePerforming.hasMoved = !lastMove.wasFirstMove
    }

    // 3. Jeżeli była bita figura, przywracamy ją na planszę
    const capturedFigure = lastMove.figureCaptured
    if (capturedFigure) {
      let capPos: Position | null
      if (lastMove.enPassant && capturedFigure instanceof Pawn) {
        // Dla en passant pionek wraca na specyficzne pole
        capturedFigure.isEnPassantPossible = true
        if (figurePerforming.color === color.White) {
          capPos = this.getPositionByCords(lastMove.move.to.x, lastMove.move.to.y + 1)
        } else {
          capPos = this.getPositionByCords(lastMove.move.to.x, lastMove.move.to.y - 1)
        }
      } else {
        // Standardowe zbicie
        capPos = this.getPosition(capturedFigure.position)
      }
      if (!capPos) throw new Error("Critical error: no position for captured figure")

      capPos.figure = capturedFigure
      capturedFigure.position = capPos
    }

    // 4. Jeżeli ruch był częścią roszady (castleMove), cofamy również przesunięcie wieży,
    //    podobnie jak w `undoLastMove`. Możesz wywołać `this.undoLastMove()` raz jeszcze,
    //    lub zrobić to analogicznie w tym samym bloku kodu.
    if (lastMove.castleMove) {
      this.undoLastMove()
    }

    // 5. Odkładamy cofnięty ruch na _redoStack, by móc go przywrócić w forwardMove
    this._redoStack.push(lastMove)

    return true
  }

  public forwardMove(): boolean {
    // Jeżeli nie mamy cofniętych ruchów, nie możemy nic przywrócić
    if (this._redoStack.length === 0) return false

    // Pobieramy ruch z wierzchu stosu _redoStack
    const redoMove = this._redoStack.pop()
    if (!redoMove) return false

    const { from, to } = redoMove.move
    const fromPos = this.getPosition(from)
    const toPos = this.getPosition(to)
    if (!fromPos || !toPos) throw new Error("Critical error: no position")

    const figurePerforming = redoMove.figurePerforming
    if (!figurePerforming) throw new Error("Critical error: no performing figure")

    // Jeżeli w miejscu docelowym stoi jakaś figura (np. przywrócona wcześniej),
    // musimy ją usunąć z planszy i z tablic figur (tak jak w moveFigure)
    if (toPos.figure) {
      const occupant = toPos.figure
      toPos.figure = null

      // Usuwamy occupant z tablic figur
      if (occupant.color === color.White) {
        this._whiteFigures = this._whiteFigures.filter((f) => f !== occupant)
      } else {
        this._blackFigures = this._blackFigures.filter((f) => f !== occupant)
      }
      this.updateArray()
    }

    // Przenosimy figurę z fromPos na toPos
    fromPos.figure = null
    toPos.figure = figurePerforming
    figurePerforming.position = toPos

    // Jeżeli w redoMove była zapisana zbita figura, to znaczy, że w oryginalnym ruchu coś zbiliśmy
    // (tzn. finalnie figuręCaptured "zniknęła" z planszy), więc nie przywracamy jej tu.
    // Wystarczy, że powyżej usunęliśmy occupant (jeśli w ogóle tam był).

    // Odtwarzamy finalny stan isFirstMove/hasMoved – w oryginalnym ruchu po jego wykonaniu
    // pionek miał isFirstMove = false, a wieża/król hasMoved = true.
    if (figurePerforming instanceof Pawn) {
      figurePerforming.isFirstMove = false
    } else if (figurePerforming instanceof Rook || figurePerforming instanceof King) {
      figurePerforming.hasMoved = true
    }

    // Jeśli ruch był roszadą/en passant, trzeba analogicznie odtworzyć tę sytuację
    // (np. przesunięcie wieży, usunięcie pionka przy en passant).
    // Możesz w tym miejscu dorzucić logikę podobną do moveFigure.

    // Na koniec wrzucamy ruch ponownie do historii
    this._moveHistory.push(redoMove)

    return true
  }

  //===================================== AI GENERATED ENDS HERE =====================================

  /**
   * returns an array of positions, on which a move is possible to be made from given position
   * debug: shows in console a chessboard with possible moves
   *
   * */
  public getValidMovesForPosition(position: Position): Position[] {
    const validMoves: Position[] = []
    // console.debug("\nValidating moves for position: ", position.notation)
    // console.debug(`\nFigure: ${position.figure?.type} \nof color: ${position.figure?.color} \nat ${position.notation} \nnoted as [o]`)
    for (let y = 0; y < 8; y++) {
      // let row = ""
      for (let x = 0; x < 8; x++) {
        const letter = this.letters[x]
        if (!letter) {
          console.error(`Invalid letter index: ${x}`)
          break
        }
        const targetPosition = this.getPositionByNotation(letter + (8 - y))
        if (!targetPosition) {
          // row += "[null]"
          break
        }
        if (targetPosition === position) {
          // row += "[&&] " //starting pos
        } else if (position.figure?.isMoveValid(targetPosition)) {
          // if (position.figure instanceof King) {
          //   if (targetPosition.figure instanceof Rook && !targetPosition.figure.hasMoved) {
          //     const deltaX = targetPosition.x - position.x
          //     const signX = deltaX === 0 ? 0 : deltaX > 0 ? 1 : -1
          //
          //     const newPos = this.getPositionByCords(position.x + 2 * signX, targetPosition.y)
          //     if (newPos) {
          //       validMoves.push(newPos)
          //       continue
          //     }
          //   }
          // }
          // row += "[--] " //valid
          validMoves.push(targetPosition)
        } else {
          // row += `[${targetPosition.notation}] ` //invalid
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
    if (!king) return false

    const enemyFigures = colorType === color.White ? this._blackFigures : this._whiteFigures

    for (const figure of enemyFigures) {
      // Sprawdź, czy figura jest "fizycznie" na planszy:
      // 1. Ma jakąś pozycję
      // 2. Ta pozycja faktycznie wskazuje na tę figurę
      if (!figure.position || figure.position.figure !== figure) {
        continue
      }
      // Dopiero wtedy sprawdzamy, czy atakuje króla
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
      this.undoLastMove()
    }

    return false
  }

  public getLegalMovesForPosition(from: Position): Position[] {
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
  private isMoveEnPassant(move: Move): boolean {
    const { from, to } = move
    const performingFigure = this.getFigureAtPosition(from)

    if (!performingFigure) return false
    // Ensure the move is a diagonal move by 1 in the x-axis
    if (Math.abs(to.x - from.x) !== 1 || Math.abs(to.y - from.y) !== 1) return false

    // Get adjacent positions (left and right)
    const leftPosition = this.getPositionByCords(from.x - 1, from.y)
    const rightPosition = this.getPositionByCords(from.x + 1, from.y)

    // Check if the adjacent figure is a Pawn with en passant possibility
    const leftFigure = leftPosition?.figure
    const rightFigure = rightPosition?.figure

    return (
      (leftFigure instanceof Pawn && leftFigure.color !== performingFigure.color && leftFigure.isEnPassantPossible && to.x === from.x - 1) ||
      (rightFigure instanceof Pawn && rightFigure.color !== performingFigure.color && rightFigure.isEnPassantPossible && to.x === from.x + 1)
    )
  }
  public promote(position: Position, promotionType: figureType.knight | figureType.queen | figureType.rook | figureType.bishop): boolean {
    if (!position || !(position.figure instanceof Pawn)) return false
    const pawn = position.figure as Pawn
    const pawnColor = pawn.color

    // Usuń pionka z odpowiedniej tablicy figur
    if (pawnColor === color.White) {
      this._whiteFigures = this._whiteFigures.filter((fig) => fig !== pawn)
    } else {
      this._blackFigures = this._blackFigures.filter((fig) => fig !== pawn)
    }

    // Utwórz nową figurę zgodnie z typem promocji
    let promotedFigure: Figure
    switch (promotionType) {
      case figureType.knight:
        promotedFigure = new Knight(pawnColor, position, this)
        break
      case figureType.queen:
        promotedFigure = new Queen(pawnColor, position, this)
        break
      case figureType.rook:
        promotedFigure = new Rook(pawnColor, position, this)
        break
      case figureType.bishop:
        promotedFigure = new Bishop(pawnColor, position, this)
        break
      default:
        return false
    }

    // Przypisz nowy unikalny identyfikator na podstawie długości _allFigures
    promotedFigure.id = this._allFigures.length

    // Ustaw nową figurę na danej pozycji
    position.figure = promotedFigure

    // Dodaj nową figurę do odpowiedniej tablicy
    if (pawnColor === color.White) {
      this._whiteFigures.push(promotedFigure)
    } else {
      this._blackFigures.push(promotedFigure)
    }

    // Zaktualizuj tablicę wszystkich figur
    this.updateArray()

    return true
  }
}
export default Board
