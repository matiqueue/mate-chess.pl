import Board from "@modules/chess/board/board"

export const rewindMove = (board: Board): boolean => {
  return board.rewindMove()
}
export const forwardMove = (board: Board): boolean => {
  return board.forwardMove()
}
