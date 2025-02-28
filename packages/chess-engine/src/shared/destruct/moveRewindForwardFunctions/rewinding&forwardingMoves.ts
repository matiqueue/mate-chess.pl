import ChessGameExtraLayer from "@modules/chessGameExtraLayer"

export const rewindMove = (game: ChessGameExtraLayer): boolean => {
  return game.board.rewindMove()
}
export const forwardMove = (game: ChessGameExtraLayer): boolean => {
  return game.board.forwardMove()
}
export const returnToCurrentState = (game: ChessGameExtraLayer): boolean => {
  if (game.board.previewMode) {
    while (game.board.previewMode) {
      game.board.forwardMove()
    }
    return true
  }
  return false
}
