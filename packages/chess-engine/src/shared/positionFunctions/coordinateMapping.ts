import ChessGame from "@modules/chessGame"
import Board from "@modules/base/board/board"

const getBoard = (game: ChessGame) => {
  return game.board
}
const getPositionByCords = (board: Board, cords: { x: number; y: number }) => {
  return board.getPositionByCords(cords.x, cords.y)
}
const getPositionByNotation = (board: Board, notation: string) => {
  if (notation.length !== 2) {
    return null
  }
  const file = notation.charAt(0)
  const rank = notation.charAt(1)

  if (!/[a-h]/.test(file) || !/[1-8]/.test(rank)) {
    return null
  }
  return board.getPositionByNotation(notation)
}
const getPositionById = (board: Board, id: number) => {
  return board.getPositionById(id)
}
