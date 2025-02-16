import ChessGameExtraLayer from "@modules/chessGameExtraLayer"
import { Position, Board } from "@utils/boardUtils"
import { Move } from "@shared/types/moveType"
import { color } from "@shared/types/colorType"

export const isMoveValid = (board: Board, move: Move): boolean => {
  return !!board?.getFigureAtPosition(move.from)?.isMoveValid(move.to)
}
export const getValidMoves = (board: Board, from: Position): Position[] => {
  const legalMoves = board.getLegalMoves(from.figure?.color as color)
  const validMoves = board.getValidMovesForPosition(from)

  return validMoves.filter((move) => legalMoves.some((legalMove) => legalMove.notation === move.notation))
}
export const whosTurn = (game: ChessGameExtraLayer): color => {
  return game?.currentPlayer
}
