import MoveRecord from "@shared/types/moveRecord"
import ChessGame from "@modules/chess/chessGame"
import { figureType } from "@modules/types"
import type MovePair from "@shared/types/movePair"

const FIGURE_SYMBOLS: Record<figureType, string> = {
  [figureType.bishop]: "B",
  [figureType.knight]: "N",
  [figureType.king]: "K",
  [figureType.queen]: "Q",
  [figureType.rook]: "R",
  [figureType.pawn]: "",
}

class MoveRecorder {
  constructor(private _game: ChessGame) {}

  public generateMoveHistory(movesArray: MoveRecord[]): MovePair[] {
    const moves = this.moveCleanup(movesArray)
    const result: MovePair[] = []

    // Przetwarzamy ruchy w parach (białe i czarne)
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

  // Metoda formatująca pojedynczy ruch
  private formatMove(record: MoveRecord): string {
    if (record.castleMove) {
      switch (Math.abs(record.move.from.y - record.move.to.y)) {
        case 2:
          return "O-O"
        case 3:
          return "O-O-O"
        default:
          console.log(`delta: ${Math.abs(record.move.from.y - record.move.to.y)}`)
          throw new Error("Something went wrong with recording castling")
      }
    } else {
      const piece = record.figurePerforming
      const symbol = FIGURE_SYMBOLS[piece.type] || ""
      let disambiguation = ""

      // if (symbol) {
      //   const boardFigures = this._game.board.allFigures
      //   // Wyszukujemy inne figury tego samego typu i koloru, które mogą wykonać ruch na ten sam cel
      //   const candidates = boardFigures.filter((p) => p !== piece)
      //   if (candidates.length > 0) {
      //     console.log("candidates ")
      //     const fromNotation = record.move.from.notation
      //     const file = fromNotation.charAt(0)
      //     const rank = fromNotation.slice(1)
      //     const sameRow = candidates.some((p) => p.position.notation.slice(1) === rank)
      //     const sameColumn = candidates.some((p) => p.position.notation.charAt(0) === file)
      //     // Jeśli inna figura na tym samym rzędzie – dodajemy oznaczenie plikiem, w przeciwnym wypadku ranką
      //     disambiguation = sameRow ? file : sameColumn ? rank : file
      //   }
      // }
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
}

export default MoveRecorder
