import chessGameExtraLayer from "@modules/chessGameExtraLayer"

export const getMoveHistory = (gameInstance: chessGameExtraLayer): string[] => {
  return gameInstance.getMoveHistory()
}
