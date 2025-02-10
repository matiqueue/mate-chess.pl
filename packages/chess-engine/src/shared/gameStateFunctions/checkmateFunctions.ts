import chessGame from "@modules/chessGame"

export const isCheckmate = (gameInstance: chessGame): "white" | "black" | null => {
  return gameInstance.isMated
}
