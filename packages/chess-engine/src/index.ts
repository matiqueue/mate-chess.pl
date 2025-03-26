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
import { color } from "@shared/types/colorType.js"
import { callAiToPerformMove } from "@shared/destruct/aiFunctions/AIIOfunctions.js"

const setupGame = () => {
  const game = new ChessGameExtraLayer()
  return game
}
const setupAIGame = (aicolor: color) => {
  const game = new ChessGameExtraAI(aicolor)
  return game
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
}
