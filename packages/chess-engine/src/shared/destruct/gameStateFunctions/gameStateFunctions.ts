import ChessGameExtraLayer from "@modules/chessGameExtraLayer"
import chessGameExtraLayer from "@modules/chessGameExtraLayer"
import { color } from "@shared/types/colorType"

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
export const setSurrender = (game: chessGameExtraLayer, surrenderingColor: color) => {
  if (game.board) {
    const whoSurrenders = surrenderingColor === color.White ? (game.gameStatus = "black wins") : (game.gameStatus = "white wins")
  }
}
export const setDraw = (game: chessGameExtraLayer) => {
  if (game.board) {
    game.gameStatus = "draw"
  }
}
