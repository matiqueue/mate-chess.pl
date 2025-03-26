import ChessGame from "@modules/chess/chessGame"
import { color } from "@shared/types/colorType"
import aiDifficulty from "@shared/types/aiDifficulty"
import { Move } from "@shared/types/moveType"
import { figureType } from "@shared/types/figureType"

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

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public async callAiToFindMove(): Promise<Move | null> {
    if (super.awaitingPromotion) {
      this.promotionTo(figureType.queen)
    }

    await this.delay(2000)

    const move = this.board.getLegalMoves(this.aiColor)[1]
    if (move) {
      return move
    }
    return null
  }
}
export default ChessAi
