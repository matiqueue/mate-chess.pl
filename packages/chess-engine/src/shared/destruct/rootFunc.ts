import ChessGame from "@modules/chess/chessGame.js"

export function startGame(game: ChessGame) {
  game.start()
  console.log("Starting Game...")
}
