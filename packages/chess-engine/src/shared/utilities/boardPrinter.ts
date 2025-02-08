import ChessGame from "@modules/chessGame"

export function printBoard(game: ChessGame) {
  game.board?.printBoard()
}
export function printFigures(game: ChessGame) {
  game.board?.printFigures()
}
export function printCords(game: ChessGame) {
  game.board?.printCords()
}
export function printIds(game: ChessGame) {
  game.board?.printIds()
}
