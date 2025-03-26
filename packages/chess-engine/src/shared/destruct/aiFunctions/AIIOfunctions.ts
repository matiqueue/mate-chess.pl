import ChessAi from "@modules/ai/engine.js"

export const callAiToPerformMove = (game: ChessAi) => {
  return game.callAiToFindMove()
}
