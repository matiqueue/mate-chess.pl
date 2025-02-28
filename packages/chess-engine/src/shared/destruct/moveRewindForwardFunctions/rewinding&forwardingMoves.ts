import ChessGameExtraLayer from "@modules/chessGameExtraLayer"

export const rewindMove = (game: ChessGameExtraLayer): boolean => {
  return game.board.rewindMove()
}
export const forwardMove = (game: ChessGameExtraLayer): boolean => {
  return game.board.forwardMove()
}
