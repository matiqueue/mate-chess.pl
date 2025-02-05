import { startGame } from "@modules/shared/rootFunctions"
import { printFigures, printBoard, printCords, printIds } from "@modules/shared/utilities/boardPrinter"
import { makeMove } from "@modules/shared/moveFunctions/moveExecution"
import { isMoveValid, getValidMovesForPosition } from "@modules/shared/moveFunctions/moveValidation"
import { castleMove } from "@modules/shared/specialMovesFunctions/castlingFunctions"
import { enPassantMove } from "@modules/shared/specialMovesFunctions/enPassantFunctions"
import ChessGame from "@modules/chessGame"
import { getBoard, getPositionByCords, getPositionByNotation, getPositionById } from "@modules/shared/positionFunctions/coordinateMapping"

const setupGame = () => {
  const game = new ChessGame()

  return game
}

export {
  startGame,
  getPositionByCords,
  getPositionByNotation,
  getPositionById,
  getBoard,
  setupGame,
  printCords,
  printIds,
  printFigures,
  printBoard,
  isMoveValid,
  makeMove,
  castleMove,
  enPassantMove,
  getValidMovesForPosition,
}
