import { isCheckmate, isStalemate, getGameStatus, isPreviewModeOn } from "@modules/shared/destruct/gameStateFunctions/gameStateFunctions"
import { getBoard, getPositionByCords, getPositionByNotation, getPositionById } from "@modules/shared/destruct/mallocFunctions/positonMapping"
import { isMoveValid, getValidMoves, whosTurn } from "@modules/shared/destruct/movementFunctions/getValidMoves"
import { makeMove } from "@modules/shared/destruct/movementFunctions/makeMove"
import { startGame } from "@shared/destruct/rootFunc"
import { undoMove } from "@shared/destruct/movementFunctions/undoMove"
import { getMoveHistory } from "@shared/destruct/movementFunctions/getMoveHistory"
import ChessGameExtraLayer from "@modules/chessGameExtraLayer"
import ChessGameExtraAI from "@modules/chessGameExtraAI"
import { promote, isAwaitingPromotion } from "@modules/shared/destruct/movementFunctions/extraMoves/promotion"
import { forwardMove, rewindMove, returnToCurrentState } from "@shared/destruct/moveRewindForwardFunctions/rewinding&forwardingMoves"
import { isMoveEnPassant } from "@shared/destruct/movementFunctions/extraMoves/enPassant"
import { color } from "@shared/types/colorType"
import { callAiToPerformMove, getNerdData } from "@shared/destruct/aiFunctions/AIIOfunctions"
import { setupFiguresStandard } from "@shared/destruct/mallocFunctions/figureSetup"

const setupGame = (fenNotation: string = "") => {
  const game = new ChessGameExtraLayer()
  if (isValidFEN(fenNotation)) {
    game.setupFigures(fenNotation)
  } else setupFiguresStandard(game)
  return game
}
const setupAIGame = (aicolor: color, level: number) => {
  const game = new ChessGameExtraAI(aicolor, level)
  setupFiguresStandard(game)
  return game
}

function isValidFEN(fen: string): boolean {
  const fenRegex = /^([prnbqkPRNBQK1-8]{1,8}\/){7}[prnbqkPRNBQK1-8]{1,8} [wb] (K?Q?k?q?|-) ([a-h][36]|-) \d+ \d+$/
  return fenRegex.test(fen)
}

export {
  setupGame,
  setupAIGame,
  startGame,
  isCheckmate,
  getBoard,
  getPositionByCords,
  getPositionByNotation,
  getPositionById,
  isMoveValid,
  getValidMoves,
  whosTurn,
  makeMove,
  undoMove,
  getMoveHistory,
  isStalemate,
  getGameStatus,
  promote,
  forwardMove,
  rewindMove,
  returnToCurrentState,
  isMoveEnPassant,
  isAwaitingPromotion,
  isPreviewModeOn,
  callAiToPerformMove,
  getNerdData,
}
