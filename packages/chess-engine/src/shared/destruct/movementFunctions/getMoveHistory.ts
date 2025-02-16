import chessGame from "@modules/chess/chessGame"

export const getMoveHistory = (gameInstance: chessGame): string[] => {
  return gameInstance.getMoveHistory()
}
