import chessGameExtraLayer from "@modules/chessGameExtraLayer"
import MoveRecordPublic from "@modules/chess/history/move"
import MovePair from "@shared/types/movePair"
import ChessGame from "@modules/chess/chessGame.js"

export const getMoveHistory = (gameInstance: ChessGame): MovePair[] => {
  return gameInstance.getMoveHistory()
}
