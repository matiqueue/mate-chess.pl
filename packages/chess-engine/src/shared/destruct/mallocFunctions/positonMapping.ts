import ChessGameExtraLayer from "@modules/chessGameExtraLayer"
import { Board } from "@utils/boardUtils"

export const getBoard = (game: ChessGameExtraLayer) => {
  return game.board
}
export const getPositionByCords = (board: Board, x: number, y: number) => {
  return board.getPositionByCords(x, y)
}
export const getPositionByNotation = (board: Board, notation: string) => {
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
export const getPositionById = (board: Board, id: number) => {
  return board.getPositionById(id)
}
export const getBoardArray = (board: Board): [string[]] => {
  return board.getBoardArray()
}
