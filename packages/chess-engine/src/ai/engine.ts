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
    console.log("HELLO, AI IS ACTIVE!")
    this.searchDepth = 1
  }

  public callAiToFindMove(): Move | null {
    if (super.awaitingPromotion) {
      this.promotionTo(figureType.queen)
    }

    // const start = Date.now()
    // while (Date.now() - start < 4000) {
    //   // Czekaj 4 sekundy bez użycia Promisa
    // }

    const move = this.board.getLegalMoves(this.aiColor)[1]
    if (move) {
      return move
    }
    return null
  }
}
export default ChessAi
