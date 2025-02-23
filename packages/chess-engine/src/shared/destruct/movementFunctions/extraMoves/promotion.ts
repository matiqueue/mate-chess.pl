import { Position, Board } from "@utils/boardUtils"
import { figureType } from "@shared/types/figureType"

export const promote = (board: Board, position: Position, figure: figureType.knight | figureType.queen | figureType.rook | figureType.bishop): boolean => {
  return board.promote(position, figure)
}
