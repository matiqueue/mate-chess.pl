import MovePair from "@shared/types/movePair"
import ChessGame from "@modules/chess/chessGame"

export const getMoveHistory = (gameInstance: ChessGame): MovePair[] => {
  return gameInstance.getMoveHistory()
}
