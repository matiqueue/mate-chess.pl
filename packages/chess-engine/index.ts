import ChessEngine from "./src/chessEngine.js"

/**
 * Tworzy nową instancję gry szachowej i ją inicjuje.
 */
export function createNewGame() {
  const engine = new ChessEngine()
  engine.startGame()
  return engine
}

/**
 * Eksport klasy ChessEngine
 */
export { ChessEngine }
