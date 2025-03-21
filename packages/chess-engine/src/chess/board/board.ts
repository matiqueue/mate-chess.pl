import { Bishop, Figure, King, Knight, Pawn, Queen, Rook } from "@utils/figureUtils"
import { Position } from "@utils/boardUtils"
import { color } from "@shared/types/colorType"
import { Move } from "@shared/types/moveType"
import { figureType } from "@shared/types/figureType"
import MoveRecord from "@shared/types/moveRecord"

/**
 * Class representing a chess board. <br>
 * It manages most of the logic of the game such as figures movement, validating legal and illegal moves, keeping track of all moves made and keeping track of all the figures.<br>
 * There isn't much player-related logic implemented here. Without ChessGame class wrapping around this class, there are a lot of cool and weird shenanigans possible - it allows for a lot of freedom when desiging a different gamemode.
 *
 * <br> this class has methods to setup figures on board, but those methods need to be called from higher layer - gamemode layer.
 */
class Board {
  private positions: Map<string, Position>
  private letters: string = "abcdefgh"
  private _whiteFigures: Figure[] = []
  private _blackFigures: Figure[] = []
  private _allFigures: Figure[] = []
  private positionsById: Position[] = []
  private _moveHistory: MoveRecord[] = []
  private _redoStack: MoveRecord[] = []
  private _previewIndex: number = 0
  private _previewMode: boolean = false

  /**
   * Creates an instance of Board.
   * Initializes the positions map, which is empty until setupBoard is called.
   */
  constructor() {
    this.positions = new Map()
  }
  /**
   * Sets up the chess board by creating all 64 positions with their respective notations.
   * @returns {boolean} True if the board is properly set up (64 positions), false otherwise.
   */
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

  /**
   * Returns a reference to position by its chess notation.
   * @param {string} notation - Chess notation (e.g. "e4").
   * @returns {Position | null} The corresponding position, or null if not found.
   */
  public getPositionByNotation(notation: string): Position | null {
    const position = this.positions.get(notation)
    if (!position) {
      console.error(`Position "${notation}" does not exist on the board.`)
      return null
    }
    return position
  }
  /**
   * Returns a reference using a position reference. Internally uses the notation.
   * @param {Position} position - The position used for lookup.
   * @returns {Position | null} The found position, or null if not found.
   */
  public getPosition(position: Position): Position | null {
    return this.getPositionByNotation(position.notation)
  }
  /**
   * Returns a reference to position by its unique ID.
   * @param {number} id - Unique identifier (0-63).
   * @returns {Position | null} The corresponding position, or null if not found.
   */
  public getPositionById(id: number): Position | null {
    return this.positionsById[id] || null // Dostęp w O(1)
  }
  /**
   * Returns a reference to position by its x and y coordinates.
   * @param {number} positionX - X-coordinate (0-7).
   * @param {number} positionY - Y-coordinate (0-7).
   * @returns {Position | null} The corresponding position, or null for invalid coordinates.
   */
  public getPositionByCords(positionX: number, positionY: number): Position | null {
    const posX = this.letters[positionX]
    if (!posX) {
      // console.error(`Position "${positionX}" does not exist on the board.`)
      return null
    }
    const notation = posX + (8 - positionY) // Adjust rank mapping
    return this.getPositionByNotation(notation)
  }

  /**
   * Adds a figure to a specified board position. <br>
   * When using this method to place figures at the start of the game for example, please use ChessGame layer as a gamemode.
   * @param {Position} position - The target position.
   * @param {Figure} figure - The chess figure to add.
   * @returns {boolean} True if the figure was added, false if the position is invalid or occupied.
   */
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
    this.updateAllFiguresArray()
    // console.log(`Figure of id ${figure.id}, type: ${figure.type} and color: ${figure.color} was added at position: ${existingPos.notation}`)
    return true
  }

  /**
   * Returns reference to the figure placed at a given position.
   * @param {Position} position - The board position.
   * @returns {Figure | null} The figure at the position, or null if empty.
   */

  public getFigureAtPosition(position: Position): Figure | null {
    return position.figure
  }

  /**
   * Complex method to handle all sorts of movement on the chessboard. It also handles eliminating enemy figures and validating pseudolegal moves int legal ones
   * Be carful when editing this method, as it is rather delicate and you might break something and not even know that until later testing.
   * updates move history when move is performed
   * @param {Move} move - Object containing the source ('from') and destination ('to') positions.<hr>
   * @param {boolean} [simulate=false] - If true, simulates the move without permanently altering the game state.
   * @returns {boolean} True if the move is executed successfully, false otherwise.
   * @throws {Error} Throws an error if there is no figure at the source position.
   */
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
      if (Math.abs(move.from.x - move.to.x) === 1 && Math.abs(move.from.y - move.to.y) === 1 && !toPos.figure && this.isMoveEnPassant(move)) {
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
            this.updateAllFiguresArray()
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
            this.updateAllFiguresArray()
          }
          figure.position = toPos
          fromPos.figure = null
          toPos.figure = figure

          this._moveHistory.push(new MoveRecord(move, performingFigure, capturedFigure, wasFirstMove, false, true))
          return true
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
            toPos.figure = null

            newPosKing.figure = figure
            newPosRook.figure = capturedFigure
            capturedFigure.position = newPosRook

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
      this.updateAllFiguresArray()
    }

    figure.position = toPos
    fromPos.figure = null
    toPos.figure = figure

    this._moveHistory.push(new MoveRecord(move, figure, capturedFigure, wasFirstMove))
    return true
  }

  /**
   * Undoes the last move executed on the board. <br>
   * Used internally for simulating moves<br>
   * PLEASE be very mindful, careful and cautious when tinkering with this method, as it may cause a brutal memory leak when mishandled, especially in loops.
   * @private
   * @returns {boolean} True if the move was undone, false if move history is empty.
   * @throws {Error} Throws error if critical positions or figures are missing.
   */
  undoLastMove(): boolean {
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

  /**
   * Initializes preview mode by setting the preview index to the current move history length.
   */
  public initPreview(): void {
    this._previewIndex = this._moveHistory.length
  }

  /**
   * Cofnij PODGLĄD o jeden ruch wstecz – nie usuwa wpisu z _moveHistory.
   * Zwraca true, jeśli udało się cofnąć, false w przeciwnym razie. <br>
   * Rewinds one move in preview mode without removing it from the move history.
   * @returns {boolean} True if the preview move was rewound, false otherwise.
   */
  public rewindMove(): boolean {
    // Jeśli jesteśmy na początku partii, nie da się cofnąć dalej
    if (this._previewIndex === 0) return false
    else this.previewMode = true
    // Bierzemy ruch, który chcemy cofnąć
    const moveRecord = this._moveHistory[this._previewIndex - 1]
    if (!moveRecord) return false

    // Wykonujemy cofnięcie podobne do undoLastMove, ALE:
    //  - Nie usuwamy nic z _moveHistory
    //  - Po prostu cofamy fizycznie ruch na planszy
    this._unapplyMoveRecord(moveRecord)

    // Zmniejszamy _previewIndex, bo jesteśmy teraz „o ruch wstecz”
    this._previewIndex -= 1

    return true
  }

  /**
   * Przywróć PODGLĄD o jeden ruch do przodu – nie dodaje wpisu do _moveHistory.
   * Zwraca true, jeśli udało się „pójść w przód”, false w przeciwnym razie. <br>
   * Moves forward one move in preview mode without updating the move history.
   * @returns {boolean} True if the preview move was applied, false otherwise.
   */
  public forwardMove(): boolean {
    // Jeśli jesteśmy już na końcu historii (stan aktualny), nie ma co przywracać
    if (this._previewIndex === this._moveHistory.length) {
      this.previewMode = false
      return false
    }

    // Bierzemy ruch, który chcemy „odtworzyć”
    const moveRecord = this._moveHistory[this._previewIndex]
    if (!moveRecord) return false

    // Fizycznie aplikujemy ruch na planszy, ale nie zmieniamy _moveHistory
    this._applyMoveRecord(moveRecord)

    // Zwiększamy _previewIndex, bo jesteśmy „o ruch do przodu”
    this._previewIndex += 1

    return true
  }

  /**
   * Odpowiednik undoLastMove, ale NIE usuwa wpisu z _moveHistory.
   * Po prostu cofa ruch moveRecord na planszy. <br>
   * Reverts a move record on the board without removing it from move history.
   * @private
   * @param {MoveRecord} moveRecord - The move record to unapply.
   * @throws {Error} Throws error if critical positions or figures are missing.
   */
  private _unapplyMoveRecord(moveRecord: MoveRecord): void {
    const beforePosition = this.getPosition(moveRecord.move.from)
    const afterPosition = this.getPosition(moveRecord.move.to)
    if (!beforePosition || !afterPosition) throw new Error("Critical error: no position")

    const figurePerforming = moveRecord.figurePerforming
    if (!figurePerforming) throw new Error("Critical error: no performing figure")

    // Cofamy figurę na pole startowe
    beforePosition.figure = figurePerforming
    figurePerforming.position = beforePosition
    afterPosition.figure = null

    // Przywróć status isFirstMove/hasMoved
    if (figurePerforming instanceof Pawn) {
      figurePerforming.isFirstMove = moveRecord.wasFirstMove
    } else if (figurePerforming instanceof Rook || figurePerforming instanceof King) {
      figurePerforming.hasMoved = !moveRecord.wasFirstMove
    }

    // Jeżeli była bita figura – przywróć ją
    const capturedFigure = moveRecord.figureCaptured
    if (capturedFigure) {
      let capPos: Position | null
      if (moveRecord.enPassant && capturedFigure instanceof Pawn) {
        capturedFigure.isEnPassantPossible = true
        // Ustal właściwą pozycję pionka (poniżej/powyżej) analogicznie do undoLastMove
        if (figurePerforming.color === color.White) {
          capPos = this.getPositionByCords(moveRecord.move.to.x, moveRecord.move.to.y + 1)
        } else {
          capPos = this.getPositionByCords(moveRecord.move.to.x, moveRecord.move.to.y - 1)
        }
      } else {
        // Normalne bicie – przywróć figurę na jej (poprzednią) pozycję
        capPos = this.getPosition(capturedFigure.position)
      }
      if (!capPos) throw new Error("Critical error: no position for captured figure")

      capPos.figure = capturedFigure
      capturedFigure.position = capPos

      // (Opcjonalnie) jeżeli w normalnym ruchu usuwałeś figurę z tablicy,
      // tu należałoby dodać ją ponownie do _whiteFigures / _blackFigures, jeśli
      // chcesz, by stan tablic też odzwierciedlał podgląd.
      if (capturedFigure.color === color.White && !this._whiteFigures.includes(capturedFigure)) {
        this._whiteFigures.push(capturedFigure)
      }
      if (capturedFigure.color === color.Black && !this._blackFigures.includes(capturedFigure)) {
        this._blackFigures.push(capturedFigure)
      }
      this.updateAllFiguresArray()
    }

    // Jeśli ruch był roszadą (castleMove), trzeba też cofnąć wieżę –
    // analogicznie jak w undoLastMove, ale bez manipulacji w _moveHistory.
    if (moveRecord.castleMove) {
      // UWAGA: w Twoim kodzie roszada bywa zapisywana w 2 MoveRecordach (król i wieża)
      // Tutaj musisz sam zadecydować, jak to odwzorować w podglądzie
      // (np. wyszukać poprzedni MoveRecord i cofnąć wieżę).
      // Możesz też trzymać w moveRecord informację o pozycji wieży, by cofnąć ją w tej metodzie.
    }
  }

  /**
   * Odpowiednik moveFigure, ale NIE dopisuje ruchu do _moveHistory.
   * Po prostu fizycznie przesuwa figurę z moveRecord na planszy.<br>
   * Applies a move record on the board without modifying move history.
   * @private
   * @param {MoveRecord} moveRecord - The move record to apply.
   * @throws {Error} Throws error if critical positions or figures are missing.
   */
  private _applyMoveRecord(moveRecord: MoveRecord): void {
    const beforePosition = this.getPosition(moveRecord.move.from)
    const afterPosition = this.getPosition(moveRecord.move.to)
    if (!beforePosition || !afterPosition) throw new Error("Critical error: no position")

    const figurePerforming = moveRecord.figurePerforming
    if (!figurePerforming) throw new Error("Critical error: no performing figure")

    // Jeśli na docelowym polu jest jakaś figura, usuń ją (podgląd bicie)
    const occupant = afterPosition.figure
    if (occupant) {
      afterPosition.figure = null
      // (Opcjonalnie) usuń occupant z tablic figur, jeśli chcesz odzwierciedlać to w podglądzie
      if (occupant.color === color.White) {
        this._whiteFigures = this._whiteFigures.filter((f) => f !== occupant)
      } else {
        this._blackFigures = this._blackFigures.filter((f) => f !== occupant)
      }
    }

    // Przesuń figurę
    beforePosition.figure = null
    afterPosition.figure = figurePerforming
    figurePerforming.position = afterPosition

    // Ustaw status isFirstMove/hasMoved tak, jakby ruch został wykonany
    if (figurePerforming instanceof Pawn) {
      figurePerforming.isFirstMove = false
    } else if (figurePerforming instanceof Rook || figurePerforming instanceof King) {
      figurePerforming.hasMoved = true
    }

    // Jeśli oryginalny ruch zbijał figurę (moveRecord.figureCaptured),
    // to w finalnym stanie po ruchu ta figura powinna zniknąć z planszy,
    // więc tu nic nie przywracamy.
    // Ale np. enPassant – musisz odwzorować analogicznie jak w moveFigure.

    // Roszada – jeśli moveRecord.castleMove, trzeba też przesunąć wieżę
    // analogicznie do moveFigure. Podgląd to odzwierciedli.

    this.updateAllFiguresArray()
  }

  //===================================== AI GENERATED ENDS HERE =====================================

  /**
   * Retrieves valid moves (pseudo-legal) for a given position.
   * Debug: wypisuje w konsoli planszę z możliwymi ruchami.
   * @param {Position} position - The starting position.
   * @returns {Position[]} Array of positions to which a move is possible.
   */
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

  /**
   * Returns the reference to white king figure.
   * @returns {Figure | null} The white king, or null if not found.
   */
  public getWhiteKing(): Figure | null {
    for (const figure of this._whiteFigures) {
      if (figure instanceof King) {
        return figure
      }
    }
    return null
  }

  /**
   * Returns the reference to black king figure.
   * @returns {Figure | null} The black king, or null if not found.
   */
  public getBlackKing(): Figure | null {
    for (const figure of this.blackFigures) {
      if (figure instanceof King) {
        return figure
      }
    }
    return null
  }

  /**
   * Checks if the king of a given color is under attack.
   * @param {color.White | color.Black} colorType - Color of the king to check for check.
   * @returns {boolean} True if the king is in check, false otherwise.
   */
  public isKingInCheck(colorType: color.White | color.Black): boolean {
    const king = colorType === color.White ? this.getWhiteKing() : this.getBlackKing()
    if (!king) return false

    const enemyFigures = colorType === color.White ? this._blackFigures : this._whiteFigures

    for (const figure of enemyFigures) {
      if (!figure.position || figure.position.figure !== figure) {
        continue
      }
      if (figure.isMoveValid(king.position)) {
        return true
      }
    }
    return false
  }

  /**
   * Determines if any of the sides are in chechmate
   * @returns {boolean} Colour of the checkmated king or false if no checkmates were found
   */
  public isCheckmate(): color.White | color.Black | false {
    if (this.getLegalMoves(color.White).length <= 0) {
      if (this.isKingInCheck(color.White)) return color.White
    }
    if (this.getLegalMoves(color.Black).length <= 0) {
      if (this.isKingInCheck(color.Black)) return color.Black
    }
    return false
  }

  /**
   * Determines if the game is in stalemate.
   * @returns {boolean} True if the game is a stalemate, false otherwise.
   */
  public isStalemate(): boolean {
    if (this.getLegalMoves(color.White).length <= 0) {
      if (!this.isKingInCheck(color.White)) return true
    }
    if (this.getLegalMoves(color.Black).length <= 0) {
      if (!this.isKingInCheck(color.Black)) return true
    }
    return false
  }

  /**
   * Checks if a move is legal by simulating it and ensuring the king is not left in check. After simulation it undoes the move.<br>
   * please be mindful when editing this method, because it might be a source of memory leaks or critical desync errors.
   * @param move - The move to validate.
   * @returns {boolean} True if the move is legal, false otherwise.
   */
  public isLegalMove(move: Move): boolean {
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

  /**
   * Gets all valid moves for a given position and filters out those who are illegal by chess rules. <br>
   * This method is used commonly, because this is final move-valdation layer method.
   * @param {Position} from - The starting position of the figure.
   * @returns {Position[]} Array of positions representing legal move destinations.
   */
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

  /**
   * Gets all valid moves (isValidMove) of all figures, and filters those who are illegal by chess rules. Specifically - those which would put your own king in check
   * @param {color.White | color.Black} colorType - The color for which legal moves are requested.
   * @returns {Move[]} Array of legal moves.
   */
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

  /**
   * Updates the internal array of all figures (white and black).
   * @private
   */
  private updateAllFiguresArray(): void {
    this._allFigures = this._whiteFigures.concat(this._blackFigures)
  }

  /**
   * Returns a 2D array representation of the board.
   * Each cell contains a symbol representing the figure.
   * This is used by the frontend to display figures. there might be more optimal way to do this, but two different persons were making the backend and the frontend
   * so backend person just adjusted their code to work with frontend without much refactoring
   * @returns {[string[]]} 2D array of strings, each represents a chess symbol.
   */
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

  /**
   * Determines if a move qualifies as an en passant move. This method is used to bypass some constraints that are mandatory and hard-coded into Pawn class
   * @param {Move} move - The move to evaluate.
   * @returns {boolean} True if the move is en passant, false otherwise.
   */
  public isMoveEnPassant(move: Move): boolean {
    const { from, to } = move
    const performingFigure = this.getFigureAtPosition(from)

    if (!performingFigure || performingFigure.type !== figureType.pawn) return false
    if (
      (performingFigure.color === color.White && performingFigure.position.y !== 3) ||
      (performingFigure.color === color.Black && performingFigure.position.y !== 4)
    )
      return false
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

  /**
   * Promotes a pawn at the given position to a new figure.
   * @param {Position} position - The position at which the pawn is to be promoted
   * @param {figureType.knight | figureType.queen | figureType.rook | figureType.bishop} promotionType - The type of figure to promote the pawn to.
   * @returns {boolean} True if promotion is successful, false otherwise.
   */
  public promote(position: Position, promotionType: figureType.knight | figureType.queen | figureType.rook | figureType.bishop): boolean {
    if (!position || !(position.figure instanceof Pawn)) return false
    const pawn = position.figure as Pawn
    const pawnColor = pawn.color

    if (pawnColor === color.White) {
      this._whiteFigures = this._whiteFigures.filter((fig) => fig !== pawn)
    } else {
      this._blackFigures = this._blackFigures.filter((fig) => fig !== pawn)
    }

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

    promotedFigure.id = this._allFigures.length
    position.figure = promotedFigure

    if (pawnColor === color.White) {
      this._whiteFigures.push(promotedFigure)
    } else {
      this._blackFigures.push(promotedFigure)
    }
    this.updateAllFiguresArray()

    return true
  }

  public previewLastMove(): boolean {
    if (this.previewIndex > 0) {
      while (this.previewIndex !== 0) {
        this.rewindMove()
      }
      return true
    }
    return false
  }
  public getAllMaterialValue(teamColor: color) {
    let figureArray = teamColor === color.White ? this._whiteFigures : this._blackFigures
    let total = 0
    for (const piece of figureArray) {
      if (piece) {
        total += piece.materialValue
      }
    }
    return total
  }
  /**
   * Gets the current preview index. A preview index is a number of iterations the program is away from the original board. e.g when trying to acces board 3 moves ago, the preview index should be at 3
   * @returns {number} The preview index.
   */
  get previewIndex(): number {
    return this._previewIndex
  }

  /**
   * Sets a new preview index. Use with caution.
   * @warning might cause a memory leak if handled incorrectly
   * @param {number} value - The new preview index.
   */
  set previewIndex(value: number) {
    this._previewIndex = value
  }

  /**
   * Gets the current preview mode status. It doesn't do anything other than just tell the app if the preview mode is on. if it is, it will try to revert to original board when trying to e.g move figure or perform a player action
   * @returns {boolean} True if preview mode is active, false otherwise.
   */
  get previewMode(): boolean {
    return this._previewMode
  }

  /**
   * Sets the preview mode status.
   * @param {boolean} value - True to enable preview mode, false to disable.
   */
  set previewMode(value: boolean) {
    this._previewMode = value
  }

  /**
   * Retrieves an array of all figures on the board. The contents of this array is concatenation of white and black figures array
   * @returns {Figure[]} Array of all figures.
   */
  get allFigures(): Figure[] {
    this.updateAllFiguresArray()
    return this._allFigures
  }

  /**
   * Retrieves an array of MoveRecords. It is used mostly for internal managing of moves e.g when rewinding or forwarding.
   * It could be also used to undo a move but that's currently unimplemented
   * @returns {MoveRecord[]} Array of move records.
   */
  get moveHistory(): MoveRecord[] {
    return this._moveHistory
  }

  /**
   * Retrieves an array of white figures.
   * @returns {Figure[]} Array of white figures.
   */
  get whiteFigures(): Figure[] {
    return this._whiteFigures
  }

  /**
   * Retrieves an array of black figures.
   * @returns {Figure[]} Array of black figures.
   */
  get blackFigures(): Figure[] {
    return this._blackFigures
  }
}
export default Board
