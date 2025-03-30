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

/**
 * Class used to generate move history of game instance into various data types such as string or array of MoveRecord objects.
 *
 * */
class MoveRecorder {
  private _game: ChessGame
  private _moveHistoryPublic: MovePair[]

  constructor(game: ChessGame) {
    this._game = game
    this._moveHistoryPublic = []
  }

  /**
   * Generates move history based on the input params.
   *
   * @param movesArray - moves array that generated Move History has to be based on
   * @return MovePair - a pair of one white and (if exists) one black move.
   * */
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
    console.log(this.regenerateMoveString(movesArray))
    return result
  }

  /**
   * Generates move history based on the input params.
   *
   * @param movesArray - moves array that generated Move History has to be based on
   * @return a string in pgn notation of all the moves made in a game
   * */
  public regenerateMoveString(movesArray: MoveRecord[]): string {
    const moves = this.moveCleanup(movesArray)
    let result = ""
    for (let i = 0; i < moves.length; i += 2) {
      const move1 = moves[i]
      const move2 = moves[i + 1]
      if (!move1) {
        console.log("no move1 found")
        break
      }

      const white = this.formatMove(move1)
      const black = move2 ? this.formatMove(move2) : ""
      result += white + " "
      if (black !== "") {
        result += black + " "
      }
    }
    return result
  }

  /**
   * Method to format a MoveRecord into a string which is a singular move.
   * @param record - MoveRecord to be formatted into a string
   * @return string which is a singular move in pgn notation
   * */
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
      if (candidates.length > 0) {
        const fromNotation = record.move.from.notation
        const file = fromNotation.charAt(0)
        const rank = fromNotation.slice(1)
        const sameRow = candidates.some((p) => p.position.notation.slice(1) === rank)
        const sameColumn = candidates.some((p) => p.position.notation.charAt(0) === file)
        disambiguation = sameRow ? file : sameColumn ? rank : file
      }

      const capture = record.figureCaptured ? "x" : ""
      return symbol + disambiguation + capture + record.move.to.notation
    }
  }

  /**
   * Special method used internally to clean movesArray of weird moves such as castling.
   * @param movesArray - array of moves to be cleaned
   * @return a cleaned copy of movesArray.
   * */
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
