import ChessGame from "@modules/chess/chessGame"
import { color } from "@shared/types/colorType"
import aiDifficulty from "@shared/types/aiDifficulty"
import { Move } from "@shared/types/moveType"
import { figureType } from "@shared/types/figureType"

import * as moveDB from "./moveDB/all_cleaned_games.json"

class ChessAi extends ChessGame {
  private _aiColor: color
  private _opponentColor: color
  private _aiDifficulty: aiDifficulty
  private _searchDepth: number
  private _canUseDatabase: boolean = false

  private readonly EXCHANGE_MULTIPLIER = 1.2
  constructor(aiColor: color, difficulty: aiDifficulty) {
    super()
    this._aiColor = aiColor
    switch (aiColor) {
      case color.White:
        this._opponentColor = color.Black
        break
      case color.Black:
        this._opponentColor = color.White
        break
    }
    this._canUseDatabase = true

    if (difficulty === aiDifficulty.Advanced) {
      this._canUseDatabase = true
    }
    this._aiDifficulty = difficulty
    this._searchDepth = 4
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public async callAiToFindMove(): Promise<Move | null> {
    if (this.gameStatus !== "active") return null
    if (super.awaitingPromotion) {
      this.promotionTo(figureType.queen)
    }

    await this.delay(200)

    if (this._canUseDatabase) {
      let moveArray: Move[] = await this.findMoveInDatabase()

      if ((await moveArray).length < 1) {
        console.log("determining move via minmax")
        moveArray = this.aiDetermineBestMove()
      } else {
        console.log("move determined via database")
      }

      const move = moveArray[Math.floor(Math.random() * (moveArray.length - 1))]
      if (move) {
        console.log("move db ready!!!")
        return move
      }
    }

    const moveArray = this.aiDetermineBestMove()
    const move = moveArray[Math.floor(Math.random() * (moveArray.length - 1))]
    if (move) {
      console.log("move ready!!!")
      return move
    }
    return null
  }

  private evaluateBoard(): number {
    const aiValue = this.board.getAllMaterialValue(this._aiColor)
    const oppValue = this.board.getAllMaterialValue(this._opponentColor)

    const baseMaterialDifference = aiValue - oppValue
    const exchangesScore = this.evaluateExchanges()

    return baseMaterialDifference + exchangesScore
  }

  private minimax(depth: number, isMaximizing: boolean, alpha: number, beta: number): number {
    if (depth === 0) return this.evaluateBoard()

    const currentColor = isMaximizing ? this._aiColor : this._opponentColor
    const moves = this.board.getPseudoLegalMoves(currentColor)
    if (!moves.length) return this.evaluateBoard()

    if (isMaximizing) {
      let maxEval = -Infinity
      for (const move of moves) {
        if (!this.board.moveFigure(move, true)) continue
        const evalValue = this.minimax(depth - 1, false, alpha, beta)
        this.board.undoLastMove()
        maxEval = evalValue > maxEval ? evalValue : maxEval
        alpha = Math.max(alpha, evalValue)
        if (beta <= alpha) break
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
        if (beta <= alpha) break
      }
      return minEval
    }
  }
  private evaluateExchanges(): number {
    let exchangeScore = 0
    const processCaptures = (captures: { capturingValue: number; capturedValue: number }[], factor: number) => {
      for (const { capturingValue, capturedValue } of captures) {
        const diff = capturedValue - capturingValue
        if (diff > 0) exchangeScore += diff * factor
      }
    }
    processCaptures(this.getCapturingMoves(this._aiColor), this.EXCHANGE_MULTIPLIER)
    processCaptures(this.getCapturingMoves(this._opponentColor), -this.EXCHANGE_MULTIPLIER)
    return exchangeScore
  }

  private getCapturingMoves(sideColor: color): { capturingValue: number; capturedValue: number }[] {
    const results: { capturingValue: number; capturedValue: number }[] = []

    const moves = this.board.getPseudoLegalMoves(sideColor)

    for (const move of moves) {
      const fromPos = move.from
      const capturingFig = fromPos.figure
      if (!capturingFig) continue

      if (this.board.isMoveEnPassant(move)) {
        const capturedPawn = this.getPawnCapturedEnPassant(move)
        if (capturedPawn) {
          results.push({
            capturingValue: capturingFig.materialValueWithBonus,
            capturedValue: capturedPawn.materialValueWithBonus,
          })
        }
      } else {
        const toPos = move.to
        const occupant = toPos.figure
        if (occupant && occupant.color !== capturingFig.color) {
          results.push({
            capturingValue: capturingFig.materialValueWithBonus,
            capturedValue: occupant.materialValueWithBonus,
          })
        }
      }
    }
    return results
  }
  private getPawnCapturedEnPassant(move: Move) {
    const fromFig = move.from.figure
    if (!fromFig || fromFig.type !== figureType.pawn) return null

    const direction = fromFig.color === color.White ? +1 : -1
    const capturedPosY = move.to.y - direction
    const capturedPosX = move.to.x
    const capturedPos = this.board.getPositionByCords(capturedPosX, capturedPosY)
    if (!capturedPos) return null

    const victim = capturedPos.figure
    if (!victim || victim.type !== figureType.pawn) return null

    return victim
  }
  private aiDetermineBestMove(): Move[] {
    const allMoves = this.board.getLegalMoves(this._aiColor)
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

    console.log("Candidate moves: ", candidateMoves.slice(0, 6))
    return candidateMoves.slice(0, 3)
  }

  private async findMoveInDatabase(): Promise<Move[]> {
    const arrayOfMoves: Move[] = []

    try {
      if (!moveDB?.games || !Array.isArray(moveDB.games)) {
        console.error("Invalid database format")
        return arrayOfMoves
      }

      const stringToCompare = this.getMoveHistoryString()
      const arrayOfStringMoves = []

      for (const game of moveDB.games) {
        if (game.moveString.startsWith(stringToCompare)) {
          arrayOfStringMoves.push(game.moveString)
        }
      }

      const possibleMovesInNotation = []
      for (const moveString of arrayOfStringMoves) {
        possibleMovesInNotation.push(moveString.split(stringToCompare)[1])
      }

      console.log(possibleMovesInNotation)
    } catch (error) {
      console.log(error)
    }

    return arrayOfMoves
  }

  get aiColor(): color {
    return this._aiColor
  }

  get aiDifficulty(): aiDifficulty {
    return this._aiDifficulty
  }

  get searchDepth(): number {
    return this._searchDepth
  }
}
export default ChessAi
