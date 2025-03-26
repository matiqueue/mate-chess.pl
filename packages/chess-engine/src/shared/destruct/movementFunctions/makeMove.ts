import ChessGameExtraLayer from "@modules/chessGameExtraLayer"
import { Board, Position } from "@utils/boardUtils"
import { Move } from "@shared/types/moveType"
import ChessGame from "@modules/chess/chessGame"

export const makeMove = (game: ChessGame, move: Move): boolean => {
  if (game.board.previewMode) {
    while (game.board.previewMode) {
      game.board.forwardMove()
    }
  }
  let isSuccess = game.makeMove(move)
  game.process()

  return isSuccess
}
