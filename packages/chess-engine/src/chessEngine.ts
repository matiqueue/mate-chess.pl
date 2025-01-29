import Board from "./board/board.js"

/**
 * Klasa zarządzająca logiką gry szachowej (dwóch graczy).
 * W rzeczywistej aplikacji sprawdzałaby legalność ruchów, mat, pat, itp.
 */
class ChessEngine {
  private _board: Board | null = null
  private _players = ["player1", "player2"]
  private _currentPlayerIndex = 0
  private _moves: Array<{ player: string | undefined; from: number; to: number }> = []
  private _winner: string | null = null

  constructor() {
    // Możesz wywołać startGame() tutaj, jeśli chcesz
    // this.startGame()
  }

  /**
   * Inicjuje nową rozgrywkę - tworzy planszę, ustawia figury itd.
   */
  public startGame() {
    this._board = new Board()
    this._board.setupBoard()
    this._board.setupFigures()
    this._moves = []
    this._currentPlayerIndex = 0
    this._winner = null
  }

  /**
   * Metoda do wykonania ruchu przez gracza.
   * @param from pole startowe
   * @param to pole docelowe
   */
  public playMove(from: number, to: number): void {
    if (this._winner) {
      throw new Error(`Gra zakończona. Zwycięzca: ${this._winner}`)
    }

    const currentPlayer = this._players[this._currentPlayerIndex]

    // Tutaj możesz dodać sprawdzanie legalności ruchu
    // if (!this.isLegalMove(from, to)) { throw new Error('Nielegalny ruch.') }

    // Zapamiętujemy ruch
    this._moves.push({ player: currentPlayer, from, to })

    // Przenosimy figurę na planszy
    if (this._board) {
      const fromPosition: any = this._board.positions[from]
      const toPosition: any = this._board.positions[to]
      toPosition.figure = fromPosition.figure
      fromPosition.figure = null
    }

    // Sprawdzamy, czy ktoś wygrał (placeholder)
    if (this._moves.length > 10) {
      this._winner = currentPlayer as string
      return
    }

    // Zmiana gracza
    this._currentPlayerIndex = (this._currentPlayerIndex + 1) % 2
  }

  /**
   * Zwraca aktualny stan gry: planszę, aktualnego gracza, historię ruchów, itp.
   */
  public getGameState() {
    return {
      board: this._board?.positions || [],
      currentPlayer: this._players[this._currentPlayerIndex],
      moves: this._moves,
      winner: this._winner,
    }
  }
}

export default ChessEngine
