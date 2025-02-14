import { Board } from "@modules/utils/boardUtils"

class chessGame {
  private _board: Board
  constructor() {
    this._board = new Board()
    this._board.setupBoard()

    this.process()
  }

  private process() {
    this.setupFigures()
  }

  private setupFigures() {}
}
