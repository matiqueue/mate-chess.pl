import ChessGame from "@modules/chess/chessGame"
import { color, figureType, Move } from "@modules/types"
import { Board } from "@utils/boardUtils"
import { gameStatusType } from "@shared/types/gameStatusType.js"
import { PromotionFigureType } from "@modules/types.js"
import { makeMove } from "@shared/destruct/movementFunctions/makeMove.js"

class ChessAi extends ChessGame {
  private _aiColour: color
  private _opponentColour: color
  // Ustal głębokość przeszukiwania – im wyższa tym silniejszy, ale wolniejszy algorytm
  private _searchDepth: number = 4
  private _aiLevel: 1 | 2 | 3 | 4

  constructor(aiColour: color, aiLevel: 1 | 2 | 3 | 4) {
    super()
    this._aiColour = aiColour
    this._opponentColour = aiColour === color.White ? color.Black : color.White
    this._aiLevel = aiLevel
  }

  override start() {
    super.start()
  }

  protected override async process(): Promise<void> {
    if (this.currentPlayer === this._aiColour) {
      if (this.awaitingPromotion) {
        // W prostym wariancie od razu promujemy do hetmana
        this.promotionTo(figureType.queen)
      } else {
        const candidateMoves = this.determineCandidateMoves()
        if (candidateMoves.length === 0) {
          throw new Error("Ai runtime exception: no candidate moves available")
        }
        // Wybór losowy spośród kandydatów
        const randomIndex = Math.floor(Math.random() * candidateMoves.length)
        const aiMove = candidateMoves[randomIndex]
        if (!aiMove) {
          throw new Error("Ai runtime exception: chosen move is invalid")
        }
        this.makeMove(aiMove)
      }
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
    const aiValue = this.board.getAllMaterialValue(this._aiColour)
    const opponentValue = this.board.getAllMaterialValue(this._opponentColour)
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
    // Kiedy dotarliśmy do maksymalnej głębokości lub nie ma ruchów, zwróć ocenę
    if (depth === 0) {
      return this.evaluateBoard()
    }

    const currentColour = isMaximizing ? this._aiColour : this._opponentColour
    const legalMoves = this.board.getLegalMoves(currentColour)
    if (!legalMoves || legalMoves.length === 0) {
      return this.evaluateBoard()
    }

    if (isMaximizing) {
      let maxEval = -Infinity
      for (const move of legalMoves) {
        // Próba wykonania ruchu na sucho
        if (!this.board.moveFigure(move, true)) continue

        const evalValue = this.minimax(depth - 1, false, alpha, beta)
        this.board.undoLastMove()

        if (evalValue > maxEval) {
          maxEval = evalValue
        }
        if (evalValue > alpha) {
          alpha = evalValue
        }
        // Przycinka beta
        if (beta <= alpha) break
      }
      return maxEval
    } else {
      let minEval = Infinity
      for (const move of legalMoves) {
        if (!this.board.moveFigure(move, true)) continue

        const evalValue = this.minimax(depth - 1, true, alpha, beta)
        this.board.undoLastMove()

        if (evalValue < minEval) {
          minEval = evalValue
        }
        if (evalValue < beta) {
          beta = evalValue
        }
        // Przycinka alpha
        if (beta <= alpha) break
      }
      return minEval
    }
  }

  /**
   * Zwraca kandydacką tablicę ruchów dla AI.
   * Metoda ocenia wszystkie legalne ruchy, sortuje je malejąco według oceny,
   * a następnie zwraca tylko te, które są blisko najlepszego wyniku (maksymalnie 5-6 ruchów).
   * Jeśli różnica między najlepszym a resztą jest duża, tablica może zawierać mniej ruchów.
   */
  private determineCandidateMoves(): Move[] {
    const legalMoves = this.board.getLegalMoves(this._aiColour)
    if (!legalMoves || legalMoves.length === 0) {
      return []
    }

    const movesWithEval: { move: Move; eval: number }[] = []
    let bestEval = -Infinity
    let alpha = -Infinity
    let beta = Infinity

    // Oceniamy każdy ruch
    for (const move of legalMoves) {
      if (!this.board.moveFigure(move, true)) continue

      // Liczymy ocenę ruchu na podstawie minimax z alpha-beta
      const moveEval = this.minimax(this._searchDepth - 1, false, alpha, beta)
      this.board.undoLastMove()

      movesWithEval.push({ move, eval: moveEval })

      if (moveEval > bestEval) {
        bestEval = moveEval
      }
      // Aktualizujemy alpha, żeby zaoszczędzić niepotrzebne ścieżki
      alpha = Math.max(alpha, moveEval)
    }

    // Ustal tolerancję – ruchy, które różnią się o więcej niż TOLERANCE od najlepszego, odpadają
    const TOLERANCE = 10
    const candidateMoves = movesWithEval
      .filter((item) => bestEval - item.eval <= TOLERANCE)
      .sort((a, b) => b.eval - a.eval)
      .map((item) => item.move)

    // Jeśli kandydatów jest więcej niż 6, ograniczamy do 6 najlepszych
    return candidateMoves.slice(0, 6)
  }
}

export default ChessAi
