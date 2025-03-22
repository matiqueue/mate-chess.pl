import ChessGame from "@modules/chess/chessGame"
import { color, figureType, Move } from "@modules/types"
import { Board } from "@utils/boardUtils"
import { gameStatusType } from "@shared/types/gameStatusType.js"
import { PromotionFigureType } from "@modules/types.js"
import { makeMove } from "@shared/destruct/movementFunctions/makeMove.js"

class ChessAi extends ChessGame {
  private _aiColour: color
  // Ustal głębokość przeszukiwania – im wyższa tym silniejszy, ale wolniejszy algorytm
  private _searchDepth: number = 7
  private _aiLevel: 1 | 2 | 3 | 4

  constructor(AiColour: color, AiLevel: 1 | 2 | 3 | 4) {
    super()
    this._aiColour = AiColour
    this._aiLevel = AiLevel
  }

  override start() {
    super.start()
  }
  protected override async process(): Promise<void> {
    if (this.currentPlayer === this._aiColour) {
      if (this.awaitingPromotion) {
        this.promotionTo(figureType.queen)
      }
      const aiMove = this.determineBestMove()
      if (!aiMove) {
        throw new Error("Ai runtime exception")
      }
      this.makeMove(aiMove)
    }
    await super.process()
  }

  override makeMove(move: Move): boolean {
    return super.makeMove(move)
  }

  /**
   * Funkcja oceny planszy.
   * Oblicza różnicę między wartością materiałową AI a przeciwnika.
   */
  private evaluateBoard(): number {
    const opponentColour = this._aiColour === color.White ? color.Black : color.White
    const aiValue = this.board.getAllMaterialValue(this._aiColour)
    const opponentValue = this.board.getAllMaterialValue(opponentColour)
    return aiValue - opponentValue
  }

  /**
   * Rekurencyjna implementacja algorytmu minimax z alpha-beta pruning.
   * @param depth - Pozostała głębokość wyszukiwania.
   * @param isMaximizing - Flaga określająca, czy aktualnie szukamy maksymalizacji (ruch AI) czy minimalizacji (ruch przeciwnika).
   * @param alpha - Najlepsza dotychczas znaleziona wartość dla maksymalizującego.
   * @param beta - Najlepsza dotychczas znaleziona wartość dla minimalizującego.
   * @returns Ocena stanu planszy.
   */
  private minimax(depth: number, isMaximizing: boolean, alpha: number, beta: number): number {
    if (depth === 0) {
      return this.evaluateBoard()
    }

    const currentColour = isMaximizing ? this._aiColour : this._aiColour === color.White ? color.Black : color.White
    const legalMoves = this.board.getLegalMoves(currentColour)
    if (!legalMoves || legalMoves.length === 0) {
      return this.evaluateBoard()
    }

    if (isMaximizing) {
      let maxEval = -Infinity
      for (const move of legalMoves) {
        if (!this.board.moveFigure(move, true)) continue
        const evalValue = this.minimax(depth - 1, false, alpha, beta)
        this.board.undoLastMove()
        maxEval = Math.max(maxEval, evalValue)
        alpha = Math.max(alpha, evalValue)
        if (beta <= alpha) {
          // Beta cut-off
          break
        }
      }
      return maxEval
    } else {
      let minEval = Infinity
      for (const move of legalMoves) {
        if (!this.board.moveFigure(move, true)) continue
        const evalValue = this.minimax(depth - 1, true, alpha, beta)
        this.board.undoLastMove()
        minEval = Math.min(minEval, evalValue)
        beta = Math.min(beta, evalValue)
        if (beta <= alpha) {
          // Alpha cut-off
          break
        }
      }
      return minEval
    }
  }

  /**
   * Wybiera najlepszy ruch dla AI przy użyciu algorytmu minimax z alpha-beta pruning.
   * @returns Wybrany ruch lub null, jeśli brak ruchów.
   */
  private determineBestMove(): Move | null {
    const legalMoves = this.board.getLegalMoves(this._aiColour)
    let bestMove: Move | null = null
    let bestEval = -Infinity
    let alpha = -Infinity
    let beta = Infinity
    for (const move of legalMoves) {
      if (!this.board.moveFigure(move, true)) continue
      const moveEval = this.minimax(this._searchDepth - 1, false, alpha, beta)
      this.board.undoLastMove()
      if (moveEval > bestEval) {
        bestEval = moveEval
        bestMove = move
      }
      alpha = Math.max(alpha, moveEval)
    }
    return bestMove
  }
}

export default ChessAi
