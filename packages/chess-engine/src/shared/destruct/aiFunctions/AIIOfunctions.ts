import ChessAi from "@modules/ai/engine"

export const callAiToPerformMove = (game: ChessAi) => {
  return game.callAiToFindMove()
}
export const getNerdData = (game: ChessAi) => {
  return game.nerdDataString
}
