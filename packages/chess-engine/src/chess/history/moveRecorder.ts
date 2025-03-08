import MoveRecord from "@shared/types/moveRecord"
import ChessGame from "@modules/chess/chessGame"
import { color, figureType } from "@modules/types"
import type MovePair from "@shared/types/movePair"
import { Pawn } from "@utils/figureUtils"

const FIGURE_SYMBOLS: Record<figureType, string> = {
  [figureType.bishop]: "B",
  [figureType.knight]: "N",
  [figureType.king]: "K",
  [figureType.queen]: "Q",
  [figureType.rook]: "R",
  [figureType.pawn]: "",
}

class MoveRecorder {
  private _game: ChessGame
  private _moveHistoryPublic: MovePair[]

  constructor(game: ChessGame) {
    this._game = game
    this._moveHistoryPublic = []
  }

  public regenerateMoveHistory(movesArray: MoveRecord[]): MovePair[] {
    const moves = this.moveCleanup(movesArray)
    const result: MovePair[] = []

    for (let i = 0; i < moves.length; i += 2) {
      const move1 = moves[i]
      const move2 = moves[i + 1]
      if (!move1) {
        console.log("no move1 found")
        break
      }

      const white = this.formatMove(move1)
      const black = move2 ? this.formatMove(move2) : ""
      result.push({ white, black })
    }
    return result
  }

  // public recordMove(movesArray: MoveRecord[]): boolean {
  //   const moves = this.moveCleanup(movesArray)
  //   // Obecnie zapisano ruchy jako pary – każda para zajmuje dwa ruchy
  //   const recordedMovesCount = this._moveHistoryPublic.length * 2
  //
  //   // Iterujemy tylko po nowych ruchach, które jeszcze nie zostały zapisane
  //   for (let i = recordedMovesCount; i < moves.length; i += 2) {
  //     const white = this.formatMove(moves[i])
  //     const black = i + 1 < moves.length ? this.formatMove(moves[i + 1]) : ""
  //     this._moveHistoryPublic.push({ white, black })
  //   }
  //   return true
  // }

  private formatMove(record: MoveRecord): string {
    const delta = Math.abs(record.move.from.x - record.move.to.x)
    if (record.castleMove) {
      switch (delta) {
        case 2:
          return "O-O"
        case 3:
          return "O-O-O"
        default:
          console.log(`delta: ${delta}`)
          throw new Error("Something went wrong with recording castling. delta between performing figures is different value than it should.")
      }
    } else {
      const piece = record.figurePerforming
      let symbol = FIGURE_SYMBOLS[piece.type] || ""
      switch (piece.color) {
        case color.White:
          symbol = symbol.toUpperCase()
          break
        case color.Black:
          symbol = symbol.toLowerCase()
          break
        default:
          console.error(`moveRecorder failed switch case statement for finding symbol. piece.color might be not-existant ${piece.color}`)
          break
      }
      let disambiguation = ""

      const boardFigures = this._game.board.allFigures

      const candidates = boardFigures.filter((p) => {
        if (p !== piece && p.type === piece.type && p.color === piece.color) {
          if (piece instanceof Pawn && Math.abs(record.move.from.x - record.move.to.x) === 0) {
            return false
          } else {
            return p.isPositionValid(record.move.to)
            //schizophrenia chess gamemode below
            // this._game.undoMove()
            // const res = p.isPositionValid(record.move.to)
            // this._game.board.forwardMove()
            // return res
          }
        }
        return false
      })
      console.log("candidates ", candidates)
      if (candidates.length > 0) {
        console.log("candidates ")
        const fromNotation = record.move.from.notation
        const file = fromNotation.charAt(0)
        const rank = fromNotation.slice(1)
        const sameRow = candidates.some((p) => p.position.notation.slice(1) === rank)
        const sameColumn = candidates.some((p) => p.position.notation.charAt(0) === file)
        // Jeśli inna figura na tym samym rzędzie – dodajemy oznaczenie plikiem, w przeciwnym wypadku ranką
        disambiguation = sameRow ? file : sameColumn ? rank : file
      }

      const capture = record.figureCaptured ? "x" : ""
      return symbol + disambiguation + capture + record.move.to.notation
    }
  }

  private moveCleanup(movesArray: MoveRecord[]): MoveRecord[] {
    const cleanedMoves: MoveRecord[] = []
    for (const currentMove of movesArray) {
      if (currentMove.castleMove && cleanedMoves.length > 0) {
        const lastMove = cleanedMoves[cleanedMoves.length - 1]
        if (lastMove?.figurePerforming.color === currentMove.figurePerforming.color) {
          cleanedMoves.pop()
        }
      }
      cleanedMoves.push(currentMove)
    }
    return cleanedMoves
  }

  get moveHistoryPublic(): MovePair[] {
    return this._moveHistoryPublic
  }
}

export default MoveRecorder
