import Board from "@modules/chess/board/board"
import { Move } from "@shared/types/moveType"

export const isMoveEnPassant = (board: Board, move: Move): boolean => {
  return board.isMoveEnPassant(move)
}
