import ChessGameExtraLayer from "@modules/chessGameExtraLayer"
import { Position, Board } from "@utils/boardUtils"
import { Move } from "@shared/types/moveType"
import { color } from "@shared/types/colorType"

export const isMoveValid = (board: Board, move: Move): boolean => {
  return board.isLegalMove(move)
}
export const getValidMoves = (board: Board, from: Position): Position[] => {
  if (!from.figure) return []
  if (board.previewMode) {
    while (board.previewMode) {
      board.forwardMove()
    }
  }
  return board.getLegalMovesForPosition(from)
}
export const whosTurn = (game: ChessGameExtraLayer): color => {
  return game?.currentPlayer
}
