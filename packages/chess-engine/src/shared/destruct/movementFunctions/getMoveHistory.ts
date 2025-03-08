import chessGameExtraLayer from "@modules/chessGameExtraLayer"
import MoveRecordPublic from "@modules/chess/history/move"
import MovePair from "@shared/types/movePair"

export const getMoveHistory = (gameInstance: chessGameExtraLayer): MovePair[] => {
  return gameInstance.getMoveHistory()
}
