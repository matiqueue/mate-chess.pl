import Position from "../position.js"

/**
 * Klasa reprezentująca planszę do gry.
 */
export default class Board {
  public positions: Position[] = []

  setupBoard() {
    for (let i = 0; i < 64; i++) {
      this.positions.push(new Position(i))
    }
  }

  setupFigures() {
    // Placeholder - w rzeczywistej implementacji ustaw figury
    console.log("Figures set up on the board.")
  }
}
