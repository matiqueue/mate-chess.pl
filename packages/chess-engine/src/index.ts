import { isCheckmate, isStalemate, getGameStatus } from "@modules/shared/destruct/gameStateFunctions/gameStateFunctions"
import { getBoard, getPositionByCords, getPositionByNotation, getPositionById } from "@modules/shared/destruct/mallocFunctions/positonMapping"
import { isMoveValid, getValidMoves, whosTurn } from "@modules/shared/destruct/movementFunctions/getValidMoves"
import { makeMove } from "@modules/shared/destruct/movementFunctions/makeMove"
import { startGame } from "@shared/destruct/rootFunc"
import { undoMove } from "@shared/destruct/movementFunctions/undoMove"
import { getMoveHistory } from "@shared/destruct/movementFunctions/getMoveHistory"
import ChessGameExtraLayer from "@modules/chessGameExtraLayer"
import { promote } from "@modules/shared/destruct/movementFunctions/extraMoves/promotion"
import { forwardMove, rewindMove, returnToCurrentState } from "@shared/destruct/moveRewindForwardFunctions/rewinding&forwardingMoves"

const setupGame = () => {
  const game = new ChessGameExtraLayer()
  return game
}

export {
  setupGame,
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
}
