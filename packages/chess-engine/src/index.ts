import { isCheckmate } from "@modules/shared/destruct/gameStateFunctions/gameStateFunctions"
import { getBoard, getPositionByCords, getPositionByNotation, getPositionById } from "@modules/shared/destruct/mallocFunctions/positonMapping"
import { isMoveValid, getValidMoves, whosTurn } from "@modules/shared/destruct/movementFunctions/getValidMoves"
import { makeMove } from "@modules/shared/destruct/movementFunctions/makeMove"
import ChessGameExtraLayer from "@modules/chessGameExtraLayer"
import type colorType from "@chesstypes/colorType"
import type figureType from "@chesstypes/figureType"
import type moveType from "@chesstypes/moveType"

const setupGame = () => {
  const game = new ChessGameExtraLayer()
  return game
}

export {
  isCheckmate,
  getBoard,
  getPositionByCords,
  getPositionByNotation,
  getPositionById,
  isMoveValid,
  getValidMoves,
  whosTurn,
  makeMove,
  setupGame,
  colorType,
  figureType,
  moveType,
}
