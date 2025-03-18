import ChessGame from "@modules/chess/chessGame.js"
import { color, Move } from "@modules/types.js"
import { Board, Position } from "@utils/boardUtils"
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
    await super.process()

    if (this.currentPlayer === this.aiColour) {
      this.makeMove(this.determineBestMove())
    }
  }

  // override promotionTo: (selectedFigure: PromotionFigureType) => boolean

  override makeMove(move: Move): boolean {
    return super.makeMove(move)
  }

  override undoMove(): boolean {
    return super.undoMove()
  }

  override getMoveHistory(): any {
    return super.getMoveHistory()
  }

  override gameDraw() {
    super.gameDraw()
  }

  override get currentPlayer(): color.White | color.Black {
    return super.currentPlayer
  }

  override set currentPlayer(value: color.White | color.Black) {
    super.currentPlayer = value
  }

  override get board(): Board {
    return super.board
  }

  override get isGameOn(): boolean {
    return super.isGameOn
  }

  override set gameStatus(value: gameStatusType) {
    super.gameStatus = value
  }

  override get gameStatus(): gameStatusType {
    return super.gameStatus
  }

  protected override setupFigures() {
    super.setupFigures()
  }

  override get awaitingPromotion(): boolean {
    return super.awaitingPromotion
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
