import ChessGameExtraLayer from "@modules/chessGameExtraLayer"
import color from "@chesstypes/colorType"

export const isCheckmate = (game: ChessGameExtraLayer): color | undefined | null => {
  if (game.board) {
    return game.board.isCheckmate()
  }
}
