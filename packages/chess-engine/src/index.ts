import ChessGame from "@modules/chess/chessGame"
import { Bishop } from "@utils/figureUtils"
import color from "@chesstypes/colorType"
const game = new ChessGame()
game.start()

const pos = game._board.getPositionByNotation("e3")
if (pos) {
  const fig = new Bishop(color.White, pos, game._board)
  game._board.addFigureAtPosition(pos, fig)
  game._board.getValidMovesForPosition(pos)
}
