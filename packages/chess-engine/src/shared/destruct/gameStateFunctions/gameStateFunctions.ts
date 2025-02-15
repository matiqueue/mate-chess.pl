import ChessGameExtraLayer from "@modules/chessGameExtraLayer"
import { color } from "@shared/types/colorType"

export const isCheckmate = (game: ChessGameExtraLayer): color | undefined | null => {
  if (game.board) {
    return game.board.isCheckmate()
  }
}
