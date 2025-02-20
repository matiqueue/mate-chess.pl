import ChessGame from "@modules/chess/chessGame"

export const rewindMove = (gameInstance: ChessGame): boolean => {
  return gameInstance.undoMove()
}
