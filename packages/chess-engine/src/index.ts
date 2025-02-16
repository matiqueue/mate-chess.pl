import { isCheckmate } from "@modules/shared/destruct/gameStateFunctions/gameStateFunctions"
import { getBoard, getPositionByCords, getPositionByNotation, getPositionById } from "@modules/shared/destruct/mallocFunctions/positonMapping"
import { isMoveValid, getValidMoves, whosTurn } from "@modules/shared/destruct/movementFunctions/getValidMoves"
import { makeMove } from "@modules/shared/destruct/movementFunctions/makeMove"
import { startGame } from "@shared/destruct/rootFunc"
import { rewindMove } from "@shared/destruct/movementFunctions/undoMove"
import { getMoveHistory } from "@shared/destruct/movementFunctions/getMoveHistory"
import ChessGameExtraLayer from "@modules/chessGameExtraLayer"

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
  rewindMove,
  getMoveHistory,
}
