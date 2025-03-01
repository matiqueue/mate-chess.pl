import { figureType } from "@shared/types/figureType"
import ChessGameExtraLayer from "@modules/chessGameExtraLayer"
import chessGameExtraLayer from "@modules/chessGameExtraLayer"

export const promote = (game: ChessGameExtraLayer, figure: figureType.knight | figureType.queen | figureType.rook | figureType.bishop): boolean => {
  return game.promotionTo(figure)
}
export const isAwaitingPromotion = (game: chessGameExtraLayer): boolean => {
  return game.awaitingPromotion
}
