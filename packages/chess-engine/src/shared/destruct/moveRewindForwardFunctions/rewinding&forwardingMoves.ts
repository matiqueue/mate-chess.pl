import ChessGameExtraLayer from "@modules/chessGameExtraLayer"
import ChessGame from "@modules/chess/chessGame"

export const rewindMove = (game: ChessGame): boolean => {
  return game.board.rewindMove()
}
export const forwardMove = (game: ChessGame): boolean => {
  return game.board.forwardMove()
}
export const returnToCurrentState = (game: ChessGame): boolean => {
  if (game.board.previewMode) {
    while (game.board.previewMode) {
      game.board.forwardMove()
    }
    return true
  }
  return false
}
