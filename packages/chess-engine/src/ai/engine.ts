import ChessGame from "@modules/chess/chessGame"
import { color, figureType, Move } from "@modules/types"
import { Board } from "@utils/boardUtils"
import { PromotionFigureType } from "@modules/types.js"

/**
 * Klasa ChessAi – z dodaną heurystyką preferującą
 * korzystne bicie i unikającą oddawania figur
 * za bezcen.
 */
class ChessAi extends ChessGame {
  private _aiColour: color
  private _opponentColour: color

  private _searchDepth: number = 4
  private _aiLevel: 1 | 2 | 3 | 4

  private static readonly EXCHANGE_MULTIPLIER = 0.2

  constructor(aiColour: color, aiLevel: 1 | 2 | 3 | 4) {
    super()
    this._aiColour = aiColour
    this._opponentColour = aiColour === color.White ? color.Black : color.White
    this._aiLevel = aiLevel
  }

  override start() {
    super.start()
  }

  /**
   * Główna pętla procesu – gdy przychodzi kolej AI,
   * wyliczamy ruch i go wykonujemy.
   */
  protected override async process() {
    super.stateProcessor()
    this.moveProcessor()
    super.process()
  }
  private async moveProcessor(): void {
    if (this.currentPlayer === this._aiColour) {
      if (this.awaitingPromotion) {
        // W prostym wydaniu promujemy do hetmana
        this.promotionTo(figureType.queen)
      } else {
        const candidateMoves = this.determineCandidateMoves()
        if (candidateMoves.length === 0) {
          throw new Error("Ai runtime exception: no candidate moves available")
        }
        const randomIndex = Math.floor(Math.random() * candidateMoves.length)
        const aiMove = candidateMoves[randomIndex]
        if (!aiMove) {
          throw new Error("Ai runtime exception: chosen move is invalid")
        }
        this.makeMove(aiMove)
      }
    }
  }
  override makeMove(move: Move): boolean {
    return super.makeMove(move)
  }

  /**
   * Funkcja oceny pozycji.
   * 1) Różnica w wartości materiału (AI - Opponent)
   * 2) Dodatkowy term – preferencje co do bicia
   */
  private evaluateBoard(): number {
    const aiValue = this.board.getAllMaterialValue(this._aiColour)
    const oppValue = this.board.getAllMaterialValue(this._opponentColour)

    const baseMaterialDifference = aiValue - oppValue
    const exchangesScore = this.evaluateExchanges()

    return baseMaterialDifference + exchangesScore
  }

  /**
   * Funkcja przyznająca drobny bonus za to, że AI może
   * tanio zbić droższą figurę, oraz karę za to,
   * że przeciwnik może zrobić to samo nam.
   */
  private evaluateExchanges(): number {
    let exchangeScore = 0
    const processCaptures = (captures: { capturingValue: number; capturedValue: number }[], factor: number) => {
      for (const { capturingValue, capturedValue } of captures) {
        const diff = capturedValue - capturingValue
        if (diff > 0) exchangeScore += diff * factor
      }
    }
    processCaptures(this.getCapturingMoves(this._aiColour), ChessAi.EXCHANGE_MULTIPLIER)
    processCaptures(this.getCapturingMoves(this._opponentColour), -ChessAi.EXCHANGE_MULTIPLIER)
    return exchangeScore
  }

  /**
   * Pomocnicza metoda zwracająca listę wszystkich bić
   * (w tym en passant) danego koloru.
   * Każdy element to para: wartość bijącej figury i wartość figury bitej.
   */
  private getCapturingMoves(sideColor: color): { capturingValue: number; capturedValue: number }[] {
    const results: { capturingValue: number; capturedValue: number }[] = []

    // Wszystkie legalne ruchy danej strony
    const moves = this.board.getLegalMoves(sideColor)

    for (const move of moves) {
      // Figura bijąca (może być null, w razie braku figur – na wszelki wypadek sprawdzamy)
      const fromPos = move.from
      const capturingFig = fromPos.figure
      if (!capturingFig) continue

      // Czy to bicie w przelocie?
      if (this.board.isMoveEnPassant(move)) {
        // Jeśli tak, musimy wyliczyć, która figura jest bita
        const capturedPawn = this.getPawnCapturedEnPassant(move)
        if (capturedPawn) {
          results.push({
            capturingValue: capturingFig.materialValue,
            capturedValue: capturedPawn.materialValue,
          })
        }
      } else {
        // Normalne bicie – sprawdzamy, czy na polu docelowym jest przeciwnik
        const toPos = move.to
        const occupant = toPos.figure
        if (occupant && occupant.color !== capturingFig.color) {
          results.push({
            capturingValue: capturingFig.materialValue,
            capturedValue: occupant.materialValue,
          })
        }
      }
    }
    return results
  }

  /**
   * Metoda pomocnicza do wyznaczenia, który pionek jest bity en passant.
   * Zwraca referencję do tej figury (lub null, jeśli coś się nie zgadza).
   */
  private getPawnCapturedEnPassant(move: Move) {
    // Kolor bijącego piona
    const fromFig = move.from.figure
    if (!fromFig || fromFig.type !== figureType.pawn) return null

    const direction = fromFig.color === color.White ? +1 : -1

    // Jeśli biały bije w przelocie, to bity pion stoi "poniżej" ruchu,
    // jeśli czarny bije w przelocie, stoi "powyżej".
    const capturedPosY = move.to.y - direction
    const capturedPosX = move.to.x
    const capturedPos = this.board.getPositionByCords(capturedPosX, capturedPosY)
    if (!capturedPos) return null

    const victim = capturedPos.figure
    if (!victim || victim.type !== figureType.pawn) return null

    return victim
  }

  /**
   * Minimax z alpha-beta pruning:
   * - Symulujemy ruch
   * - Rekurencyjnie schodzimy w głąb
   * - Cofamy ruch
   * - Szukamy max (ruch AI) lub min (ruch przeciwnika)
   */
  private minimax(depth: number, isMaximizing: boolean, alpha: number, beta: number): number {
    if (depth === 0) return this.evaluateBoard()

    const currentColor = isMaximizing ? this._aiColour : this._opponentColour
    const moves = this.board.getLegalMoves(currentColor)
    if (!moves.length) return this.evaluateBoard()

    if (isMaximizing) {
      let maxEval = -Infinity
      for (const move of moves) {
        if (!this.board.moveFigure(move, true)) continue
        const evalValue = this.minimax(depth - 1, false, alpha, beta)
        this.board.undoLastMove()
        maxEval = evalValue > maxEval ? evalValue : maxEval
        alpha = Math.max(alpha, evalValue)
        if (beta <= alpha) break // Beta-cutoff
      }
      return maxEval
    } else {
      let minEval = Infinity
      for (const move of moves) {
        if (!this.board.moveFigure(move, true)) continue
        const evalValue = this.minimax(depth - 1, true, alpha, beta)
        this.board.undoLastMove()
        minEval = evalValue < minEval ? evalValue : minEval
        beta = Math.min(beta, evalValue)
        if (beta <= alpha) break // Alpha-cutoff
      }
      return minEval
    }
  }

  /**
   * Główna metoda dobierająca kandydatów na ruch.
   * - oceniamy każdy legalny ruch
   * - filtrujemy te, które odstają za bardzo od najlepszego wyniku
   * - zwracamy maksymalnie np. 6
   */
  private determineCandidateMoves(): Move[] {
    const allMoves = this.board.getLegalMoves(this._aiColour)
    if (!allMoves.length) return []

    let bestEval = -Infinity
    const movesWithEval: { move: Move; eval: number }[] = []
    let alpha = -Infinity
    let beta = Infinity

    for (const move of allMoves) {
      if (!this.board.moveFigure(move, true)) continue
      const evalValue = this.minimax(this._searchDepth - 1, false, alpha, beta)
      this.board.undoLastMove()
      movesWithEval.push({ move, eval: evalValue })
      bestEval = evalValue > bestEval ? evalValue : bestEval
      alpha = Math.max(alpha, evalValue)
    }

    const TOLERANCE = 4
    const candidateMoves = movesWithEval
      .filter((item) => bestEval - item.eval <= TOLERANCE)
      .sort((a, b) => b.eval - a.eval)
      .map((item) => item.move)

    return candidateMoves.slice(0, 6)
  }
}

export default ChessAi
