import ChessGame from "@modules/chess/chessGame"
import { color } from "@shared/types/colorType"
import aiDifficulty from "@shared/types/aiDifficulty"
import { Move } from "@shared/types/moveType"
import { figureType } from "@shared/types/figureType"

import moveDB from "./moveDB/all_cleaned_games.json"

/**
 * Instance of a chessGame with ai included.
 * Ai is currently very heavily work in progress. Currently it shouldn't play as whites because that might bug the hell out of the game <br>
 * It uses a lot of asynchronus methods, and has a database of 622 chess games played by 12 real grandmasters. <br>If the AI is set to the Advanced level, it will try to play one of the games of those grandmasters. <br>If the game isn't simmilair to any game in database, it will use generic minimax with alphabeta pruning algorithm to play the rest of the game
 * */
class ChessAi extends ChessGame {
  private _aiColor: color
  private _opponentColor: color
  private _aiDifficulty: aiDifficulty
  private _searchDepth: number
  private _canUseDatabase: boolean = true

  private _nerdDataString: string = ""

  private readonly EXCHANGE_MULTIPLIER = 1.2
  constructor(aiColor: color, difficulty: aiDifficulty) {
    //TODO, zrobić tak żeby to ai w ogóle działało gdy gra białymi xddd
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
    this._aiDifficulty = difficulty

    switch (difficulty) {
      case aiDifficulty.beginner:
        this._searchDepth = 3
        break
      case aiDifficulty.intermediate:
        this._searchDepth = 4
        break
      case aiDifficulty.advanced:
        this._canUseDatabase = true
        this._searchDepth = 5
        break
      default:
        this._searchDepth = 4
        break
    }
  }

  /**
   * Helper method to create some delay in the code. without this delay, the ai might try to calculate the moves too soon causing it to either crash or memory leak lol
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Main method to call the ai to find a good move in a game. <br>
   * returns null if some of the criteria aren't met, such as <ul>
   *   <li>The game isn't active
   *   <li>Currently it isn't ai's turn
   *   <li>No move has been found (the game should call checkmate before that happens)
   * </ul>
   * If the ai difficulty is set to advanced, it will first try to find the best move using database of 622 games played by 12 real grandmasters. If it doesn't find any, it will use minmax algorithm
   * */
  public async callAiToFindMove(): Promise<Move | null> {
    if (this.currentPlayer !== this.aiColor) return null
    if (this.gameStatus !== "active") return null
    if (super.awaitingPromotion && this.currentPlayer === this.aiColor) {
      this.promotionTo(figureType.queen)
    }

    await this.delay(200)

    if (this._canUseDatabase) {
      let moveArray: Move[] = await this.findMoveInDatabase()

      console.log("determining moves")
      console.log(moveArray)
      if (moveArray.length < 1) {
        console.log("database empty. determining move via minmax")
        console.log(moveArray)
        moveArray = this.aiDetermineBestMove()
      } else {
        console.log("move determined via database")
      }

      const move = moveArray[Math.floor(Math.random() * (moveArray.length - 1))]
      console.log(move)
      if (move) {
        console.log("db move ready!!!")
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

  /**
   * Evaluates the material value of all figures on a chessboard
   * */
  private evaluateBoard(): number {
    const aiValue = this.board.getAllMaterialValue(this._aiColor)
    const oppValue = this.board.getAllMaterialValue(this._opponentColor)

    const baseMaterialDifference = aiValue - oppValue
    const exchangesScore = this.evaluateExchanges()

    return baseMaterialDifference + exchangesScore
  }
  /**
   * Main method to find the move using math. It is minimax algorithm optimized with alpha beta pruning. <br>
   * Unfortunately, slight inoptimization of board class, causes this algorithm to be very laggy when search depth is higher than 5
   * */
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
  /**
   * Evaluates the material value of a exchange of figures. This method should make the ai be less agressive with high value figures towards low value figures*/
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

  /**
   * @return all moves that capture an enemy figure
   */
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

  /**Honestly, i have no idea what is it for*/
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
  /**
   * Wrapper method for all of the internal methods. It uses math and schizophrenia to find the best move on the board*/
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
      this.writeNerdData(String(bestEval), "Minimax loop is on...")
    }

    const TOLERANCE = 4
    let candidateMoves = movesWithEval
      .filter((item) => bestEval - item.eval <= TOLERANCE)
      .sort((a, b) => b.eval - a.eval)
      .map((item) => item.move)

    candidateMoves = candidateMoves.slice(0, 3)

    // console.log("Candidate moves: ", candidateMoves.slice(0, 6))
    this.writeNerdData(String(Math.floor(bestEval)), "minimax algorithm is being used", candidateMoves.toString())
    return candidateMoves
  }
  /**
   * Method used only by ai on the highest difficulty. <br>
   * This method loads json file with 622 chessGames, then compares its own game with those games and returns an array of all next moves that grandmasters player, then emulates them.
   * */
  private async findMoveInDatabase(): Promise<Move[]> {
    let arrayOfMoves: Move[] = []

    try {
      if (!moveDB?.games || !Array.isArray(moveDB.games)) {
        console.error("Invalid database format")
        return arrayOfMoves
      }
      console.log("Connection successful")

      const stringToCompare = this.getMoveHistoryString()
      // console.log(`Move history string: '${stringToCompare}'`)
      const arrayOfStringMoves = moveDB.games.filter((game) => game.moveString.startsWith(stringToCompare)).map((game) => game.moveString)
      // console.log("Array of stringified moves:", arrayOfStringMoves)
      const possibleMovesInNotation = arrayOfStringMoves.map((moveString) => moveString.split(stringToCompare)[1] || "")
      // console.log("Possible moves in notation:", possibleMovesInNotation)
      const extractedMoves = [...new Set(possibleMovesInNotation.map((moveString) => moveString.split(" ")[0]))]
      // console.log("Extracted moves:", extractedMoves)

      for (const extractedMove of extractedMoves) {
        if (!extractedMove) break
        let performingFigureType: figureType
        let targetPositionNotation: string = ""
        let doesMoveCaptureFig: boolean = false
        const letters = "abcdefgh"
        switch (extractedMove.charAt(0).toLowerCase()) {
          case "n":
            performingFigureType = figureType.knight
            break
          case "k":
            performingFigureType = figureType.king
            break
          case "q":
            performingFigureType = figureType.queen
            break
          case "r":
            performingFigureType = figureType.rook
            break
          case "b":
            performingFigureType = figureType.bishop
            break
          default:
            performingFigureType = figureType.pawn
            break
        }
        if (extractedMove.charAt(1).toLowerCase() === "x") {
          // console.log("Extracted move captures figures:", extractedMove)
          doesMoveCaptureFig = true
        }
        console.log("doesMoveCaptureFig:", doesMoveCaptureFig, "Move:", extractedMove)

        const letterIndex = performingFigureType === figureType.pawn ? 0 : 1
        const numIndex = performingFigureType === figureType.pawn ? 1 : 2

        const lts = extractedMove.charAt(letterIndex + Number(doesMoveCaptureFig)).toLowerCase()
        const nums = Number(extractedMove.charAt(numIndex + Number(doesMoveCaptureFig)).toLowerCase())
        console.log(extractedMove)
        // console.log(letters)
        // console.log(lts)
        if (letters.includes(lts)) {
          targetPositionNotation += lts
        } else {
          console.error("something went wrong")
        }

        if (nums > 0 && nums <= 8) {
          targetPositionNotation += nums
        }
        console.log(
          "possible moves: ",
          this.board.findValidMovesWithGivenArguments(this.aiColor, performingFigureType, doesMoveCaptureFig, targetPositionNotation),
        )
        const possibleMoves = this.board.findValidMovesWithGivenArguments(this.aiColor, performingFigureType, doesMoveCaptureFig, targetPositionNotation)
        // console.log(possibleMoves)
        // console.log(arrayOfMoves)
        arrayOfMoves.push(...possibleMoves)
        this.writeNerdData(
          "database, no eval for that",
          possibleMovesInNotation[Math.floor(Math.random() * extractedMoves.length - 1)],
          extractedMoves[Math.floor(Math.random() * extractedMoves.length - 1)],
        )
        // console.log(arrayOfMoves)
        // console.log("Target notation is: ", targetPositionNotation)
      }
    } catch (error) {
      this.writeNerdData("there was an error when fetching database data", "from now on, minmax algorithm will be used to lead the game", "no moves")
      console.error(error)
    }

    console.log("database moves table: ", arrayOfMoves)
    return arrayOfMoves
  }

  /**
   * @return color as which ai is playing*/
  get aiColor(): color {
    return this._aiColor
  }
  private writeNerdData(bestEval: string = "", similairGames: string = "", gmNextMove: string = "", additionalString: string = ""): string {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, "0")
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const year = today.getFullYear()

    const formattedDate = `${day}-${month}-${year}`
    const output =
      "Date: " +
      formattedDate +
      "\n" +
      "====Ai info====\n" +
      "\n    Ai difficulty: " +
      this._aiDifficulty +
      "\n    Ai playing as: " +
      this._aiColor +
      "\n    Ai search depth: " +
      this._searchDepth +
      "\n====Game info====" +
      "\n    White material: " +
      this.board.getAllMaterialValue(color.White) +
      "\n    Black material: " +
      this.board.getAllMaterialValue(color.Black) +
      "\n    Comparator string: " +
      this.getMoveHistoryString() +
      " \n====Ai evals====" +
      "" +
      "\nBest eval: " +
      bestEval +
      "\nsimilairGames: " +
      similairGames +
      "\nGrandmaster's next move: " +
      gmNextMove +
      "\n" +
      additionalString

    this._nerdDataString = output
    return output
  }

  get nerdDataString(): string {
    return this._nerdDataString
  }
}
export default ChessAi
