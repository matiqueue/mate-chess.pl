import ChessGame from "@modules/chess/chessGame"

export function startGame(game: ChessGame) {
  game.start()
  console.log("Starting Game...")
}
