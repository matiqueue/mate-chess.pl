class ChessEngine {
  private board: string[][]

  constructor() {
    this.board = this.initializeBoard()
  }

  private initializeBoard(): string[][] {
    return [
      ["r", "n", "b", "q", "k", "b", "n", "r"],
      ["p", "p", "p", "p", "p", "p", "p", "p"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["P", "P", "P", "P", "P", "P", "P", "P"],
      ["R", "N", "B", "Q", "K", "B", "N", "R"],
    ]
  }

  public makeMove(from: string, to: string): boolean {
    console.log(`Moving piece from ${from} to ${to}`)
    return true // Prosta implementacja ruchu
  }
}

export default ChessEngine
