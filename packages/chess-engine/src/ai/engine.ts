import ChessGame from "@modules/chess/chessGame.js"
import { color } from "@shared/types/colorType.js"
import aiDifficulty from "@shared/types/aiDifficulty"
import { Move } from "@shared/types/moveType"

class ChessAi extends ChessGame {
  private aiColor: color
  private aiDifficulty: aiDifficulty

  private searchDepth: number

  constructor(aiColor: color, aiDifficulty: aiDifficulty) {
    super()
    this.aiColor = aiColor
    this.aiDifficulty = aiDifficulty

    this.searchDepth = 1
  }

  public callAiToFindMove(): Move | null {
    const board = this.board
    const move = board.getLegalMoves(this.aiColor)[1]
    if (move) {
      return move
    }
    return null
  }
}
export default ChessAi
