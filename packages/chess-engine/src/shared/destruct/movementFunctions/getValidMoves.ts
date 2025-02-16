import ChessGameExtraLayer from "@modules/chessGameExtraLayer"
import { Position, Board } from "@utils/boardUtils"
import { Move } from "@shared/types/moveType"
import { color } from "@shared/types/colorType"

export const isMoveValid = (board: Board, move: Move): boolean => {
  return !!board?.getFigureAtPosition(move.from)?.isMoveValid(move.to)
}
export const getValidMoves = (board: Board, from: Position): Position[] => {
  if (!from.figure) return []
  //
  // const legalMoves = board.getLegalMoves(from.figure.color) // Now returns Move[]
  // const validMoves = board.getValidMovesForPosition(from)
  //
  // return validMoves.filter((move) => legalMoves.some((legalMove) => legalMove.to.notation === move.notation))
  // const moves = board.getLegalMoves(from.figure.color)
  // let validMoves: Position[] = []
  // for (const move of moves) {
  //   const position = board.getPosition(move.to)
  //   if (position) {
  //     validMoves.push(position)
  //   }
  // }
  return board.getLegalMovesForPosition(from)
}
export const whosTurn = (game: ChessGameExtraLayer): color => {
  return game?.currentPlayer
}
