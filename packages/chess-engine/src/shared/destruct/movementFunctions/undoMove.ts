import ChessGame from "@modules/chess/chessGame"

export const undoMove = (gameInstance: ChessGame): boolean => {
  return gameInstance.undoMove()
}
