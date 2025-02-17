import ChessGameExtraLayer from "@modules/chessGameExtraLayer"
import { color } from "@shared/types/colorType"
import chessGameExtraLayer from "@modules/chessGameExtraLayer"

export const isCheckmate = (game: ChessGameExtraLayer): color | false => {
  if (game.board) {
    const checkState = game.board.isCheckmate()
    switch (checkState) {
      case color.Black:
        return color.Black
      case color.White:
        return color.White
    }
  }
  return false
}
export const isStalemate = (game: ChessGameExtraLayer): boolean => {
  if (game.board) {
    if (game.gameStatus === "stalemate") return true
  }
  return false
}
export const getGameStatus = (game: chessGameExtraLayer) => {
  return game.gameStatus
}
