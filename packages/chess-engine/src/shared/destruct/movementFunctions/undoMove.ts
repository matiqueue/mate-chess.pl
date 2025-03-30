import ChessGame from "@modules/chess/chessGame"
import { returnToCurrentState } from "@shared/destruct/moveRewindForwardFunctions/rewinding&forwardingMoves"

export const undoMove = (game: ChessGame): boolean => {
  returnToCurrentState(game)
  return game.undoMove()
}
