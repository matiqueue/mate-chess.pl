/* eslint-disable @typescript-eslint/no-explicit-any */
import { Board, Position } from "@modules/utils/board"
import { King, Pawn } from "@modules/utils/figures"
import Figure from "@modules/base/figure/figure"
import { isCheckmate } from "@modules/shared/gameStateFunctions/checkmateFunctions"
/**
 * Main class for the backend. Here we will implement any NON-changable logic.<br>
 * In order to change a logic for a certain gamemode or simply game, please use "ChessGame.ts"<br>
 * Here all logic will be implemented
 *
 * @TODO <ul>
 *     <li> Update method need to call awaitPlayer()
 *     <li> Game needs to swap between Player1 and Player2 and allow them to move only their own piece
 *     <li> all methods besides start and update. I took inspiration from GodotEngine with the names and structure of the methods. Consider doing the same.
 *       <li> Methods to check for: mate, pat, check and draw
 *       </ul>
 * */
class ChessEngine {
  protected _board: Board | undefined
  private _currentPlayer: "white" | "black" = "white"
  public isGameOn: boolean = false
  public isMated: "white" | "black" | null = null
  constructor() {}
  /**
   * This method will be called four times in the first frame.<br>
   * It needs to check if it didn't allocate nemory few times for the same thing - because it is being called few times
   * , and this method is used to allocate and declare all variables and memory<br>
   * I think it should be called few times before the game, in case something goes wrong and e.g faills to allocate memory or player id*/
  public start() {
    for (let i = 0; i < 1; i++) {
      this.setupBoard()
    }
    this.update()
  }
  private setupBoard() {
    if (!this._board) {
      this._board = new Board()
    }
    this._board.setupBoard()
    this._board.setupFigures()
    this.isGameOn = true
    this.isMated = null
  }
  /**
   * This method will be called every "playerInput" action. It will proceed with regenerating and updating
   * frontend data e.g board figures position on the screen, and after all of it is done, it should
   * call awaitPlayer() so it waits for another input, instead of being called every frame. To save on computing cost and energy
   * @TODO <ul>
   *     <li> method awaitPlayer() - to wait for each player actions.
   *     <li> main game loop
   *     </ul>
   * */
  public update(): void {
    this.updateProperties()

    return //instead of await player
    this.update()
  }
  /**
   * @todo implement logic for checking for mate
   * */
  private checkForMate(): void {
    if (!this._board) return
    const whiteKing = this._board.getKing("white")
    const blackKing = this._board.getKing("black")
    if (!whiteKing || !blackKing) return

    whiteKing.isCheck = false
    blackKing.isCheck = false

    for (const figure of this._board.figures) {
      if (!figure) continue
      if (figure.color === "black" && figure.isValidMove(whiteKing.position)) {
        whiteKing.isCheck = true
      }
      if (figure.color === "white" && figure.isValidMove(blackKing.position)) {
        blackKing.isCheck = true
      }
    }
  }
  private onGameOver() {
    this.isGameOn = false
  }
  get board(): Board | undefined {
    return this._board
  }
  public makeFigureMove(move: { from: Position; to: Position }): boolean {
    if (!this.isGameOn) return false
    if (move.from.figure?.color === this.currentPlayer) {
      if (this.board?.moveFigureToPosition(move)) {
        this.switchCurrentPlayer()
      }
    }
    return false
  }
  private switchCurrentPlayer() {
    if (this.currentPlayer === "white") {
      this.currentPlayer = "black"
    } else if (this.currentPlayer === "black") {
      this.currentPlayer = "white"
    }
  }
  get currentPlayer(): "white" | "black" {
    return this._currentPlayer
  }

  set currentPlayer(value: "white" | "black") {
    this._currentPlayer = value
  }
  public updateProperties() {
    this.checkForMate()
  }
  private callCheckmate(color: "white" | "black") {
    this.onGameOver()
    this.isMated = color
  }
}

export default ChessEngine
