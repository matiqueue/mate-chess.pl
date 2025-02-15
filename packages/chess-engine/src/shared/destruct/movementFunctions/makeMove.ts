import ChessGameExtraLayer from "@modules/chessGameExtraLayer"
import { Board, Position } from "@utils/boardUtils"
import { Move } from "@shared/types/moveType"

export const makeMove = (game: ChessGameExtraLayer, move: Move): boolean => {
  let isSuccess = game.makeMove(move)
  game.process()

  return isSuccess
}
