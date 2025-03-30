import { color } from "@shared/types/colorType"
import ChessGame from "@modules/chess/chessGame"

export const isCheckmate = (game: ChessGame): color | false => {
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
export const isStalemate = (game: ChessGame): boolean => {
  if (game.board) {
    if (game.gameStatus === "stalemate") return true
  }
  return false
}
export const getGameStatus = (game: ChessGame) => {
  return game.gameStatus
}

export const isPreviewModeOn = (game: ChessGame) => {
  return game.board.previewMode
}
