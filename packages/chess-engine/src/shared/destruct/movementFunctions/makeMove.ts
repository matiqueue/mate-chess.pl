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
