import ChessGame from "@modules/chess/chessGame.js"
import { color, figureType, Move } from "@modules/types.js"
import { Board } from "@utils/boardUtils"
import { gameStatusType } from "@shared/types/gameStatusType.js"
import { PromotionFigureType } from "@modules/types.js"

class ChessAI extends ChessGame {
  private aiColour: color

  constructor(AiColour: color) {
    super()
    this.aiColour = AiColour
  }

  override start() {
    super.start()
  }

  protected override async process(): Promise<void> {
    if (this.currentPlayer === this.aiColour) {
      if (this.awaitingPromotion) {
        this.promotionTo(figureType.queen)
      }
      this.makeMove(this.determineBestMove())
    }
    await super.process()
  }

  // override promotionTo: (selectedFigure: PromotionFigureType) => boolean

  override makeMove(move: Move): boolean {
    return super.makeMove(move)
  }

  private determineBestMove(): Move {
    const from = this.board.getPositionByCords(1, 1)
    const to = this.board.getPositionByCords(1, 2)
    if (!from || !to) {
      throw new Error("Position does not exist")
    }
    const move = {
      from: from,
      to: to,
    }
    return move
  }
}
