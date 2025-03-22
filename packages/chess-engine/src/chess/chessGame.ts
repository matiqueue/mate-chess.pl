import { Board } from "@utils/boardUtils"
import { Bishop, King, Knight, Pawn, Queen, Rook } from "@utils/figureUtils"
import { color } from "@shared/types/colorType"
import { Move } from "@shared/types/moveType"
import MoveRecord from "@shared/types/moveRecord"
import { figureType } from "@shared/types/figureType"
import MoveRecorder from "@modules/chess/history/moveRecorder"
import { gameStatusType } from "@shared/types/gameStatusType"
import { PromotionFigureType } from "@shared/types/promotionType.js"

/**
 * Represents a basic chess game logic.
 * <p>
 * This class combines {@link Board} and {@link MoveRecorder} to manage the game flow,
 * track player turns, handle move history, detect game status (checkmate, stalemate, draw),
 * and process pawn promotions.
 * </p>
 * <p>
 * <strong>Note:</strong> This is a base game instance and should only contain core functionality
 * that is shared across all game modes. To implement different game modes (e.g., versus bot, multiplayer),
 * extend this class.
 * </p>
 * <p>
 * For chess engine logic (e.g., move validation, bot logic), refer to <code>engine.ts</code>.
 * </p>
 */
class ChessGame {
  private _board: Board
  private _currentPlayer: color.White | color.Black
  private _moves: MoveRecord[] = []
  private _isGameOn: boolean = false
  private _awaitingPromotion: boolean = false
  private _moveRecorder: MoveRecorder
  private _gameStatus: gameStatusType = gameStatusType.paused
  constructor() {
    this._board = new Board()
    this._board.setupBoard()
    this.setupFigures()
    this._currentPlayer = color.White
    this._moveRecorder = new MoveRecorder(this)
    this.promotionTo = this.promotionTo.bind(this)
  }
  /**
   * Starts the game by activating it and triggering the game processing loop.
   */
  start(): void {
    this._gameStatus = gameStatusType.active
    this._isGameOn = true
    this.process()
  }
  /**Single iteration of the engine. Checks for checkmates and stalemates, promotions and updates move history.
   * */
  protected async process() {
    if (this._board.isCheckmate() === this.currentPlayer) {
      if (this.currentPlayer === color.Black) {
        this._gameStatus = gameStatusType.whiteWins
      } else if (this.currentPlayer === color.White) {
        this._gameStatus = gameStatusType.blackWins
      }
      this._isGameOn = false
    } else if (this._board.isStalemate()) {
      this._gameStatus = gameStatusType.stalemate
      this._isGameOn = false
    }

    for (const figure of this._board.allFigures) {
      if (figure instanceof Pawn && !this._awaitingPromotion) {
        if ((figure.color === color.White && figure.position.y === 0) || (figure.color === color.Black && figure.position.y === 7)) {
          this._awaitingPromotion = true
          const promotionType = await this.promotionFigure()
          this.board.promote(figure.position, promotionType)
          break
        }
      }
    }

    this._moves = this._board.moveHistory
  }
  private promotionPromise: Promise<PromotionFigureType> | null = null
  private promotionPromiseResolver: ((figure: PromotionFigureType) => void) | null = null

  /**
   * Waits for a promotion input from the player.
   * <p>
   * This method returns a Promise that resolves when the user selects a figure type
   * via the {@link promotionTo} method. It is used to pause the game logic until
   * the promotion is resolved.
   * </p>
   * <p>
   * Should only be called when a pawn reaches the promotion rank and no promotion is currently being processed.
   * </p>
   * @returns a Promise that resolves to the selected {@link PromotionFigureType}
   */
  private promotionFigure(): Promise<PromotionFigureType> {
    console.log("Tworzę nowy Promise do promocji")
    if (!this.promotionPromise) {
      this.promotionPromise = new Promise((resolve) => {
        this.promotionPromiseResolver = (figure) => {
          console.log("Rozwiązuję promisa z figurą:", figure)
          resolve(figure)
        }
      })
    }
    return this.promotionPromise
  }
  /**
   * Allows the frontend or external handler to complete a promotion
   * by selecting the figure type to promote to.
   *
   * @param selectedFigure the figure to promote the pawn to (Queen, Rook, Knight, or Bishop)
   * @returns true if promotion was successfully processed, otherwise throws an error
   * @throws Error if no promotion is currently awaited
   */
  public promotionTo = (selectedFigure: PromotionFigureType): boolean => {
    console.log("promotionTo wywołane. this:", this)
    console.log("this.promotionPromiseResolver:", this.promotionPromiseResolver)
    if (this.promotionPromiseResolver) {
      this.promotionPromiseResolver(selectedFigure)
      // Resetujemy promise oraz flagę oczekiwania, aby możliwe było kolejne promowanie
      this.promotionPromise = null
      this.promotionPromiseResolver = null
      this._awaitingPromotion = false
      return true
    }
    console.error("Brak resolvera dla promocji")
    throw new Error("No promotion resolver")
  }

  /**
   * Attempts to make a move on the board.
   * If the move is valid and it's the player's turn, it performs the move,
   * resets en passant flags, switches turns, and triggers move preview setup.
   *
   * @param move the move to be made
   * @returns true if move was successfully made, false otherwise
   */
  public makeMove(move: Move): boolean {
    if (this.board.previewIndex > 0) {
      while (this.board.previewMode) {
        this.board.forwardMove()
      }
    }
    if (!this._isGameOn) return false
    if (move.from.figure?.color === this.currentPlayer) {
      if (this._board?.moveFigure(move)) {
        const figures = this.currentPlayer === color.Black ? this.board.whiteFigures : this.board.blackFigures
        for (const figure of figures) {
          if (figure instanceof Pawn) {
            figure.isEnPassantPossible = false
          }
        }
        this.switchCurrentPlayer()
        this.board.initPreview()
        return true
      }
    }
    return false
  }
  /**
   * Undoes the last move made by the player using preview mode logic.
   *
   * @returns true if move was undone, false if undo is not available
   */
  public undoMove(): boolean {
    return this.board.previewLastMove()
  }
  /**
   * Regenerates and returns the move history using {@link MoveRecorder}.
   *
   * @returns formatted move history
   */
  public getMoveHistory(): any {
    console.log(this._moveRecorder.regenerateMoveHistory(this._moves))
    return this._moveRecorder.regenerateMoveHistory(this._moves)
  }

  public gameDraw() {
    this._gameStatus = gameStatusType.draw
    this._isGameOn = false
  }
  private switchCurrentPlayer() {
    if (this.currentPlayer === color.White) {
      this.currentPlayer = color.Black
    } else if (this.currentPlayer === color.Black) {
      this.currentPlayer = color.White
    }
  }
  get currentPlayer(): color.White | color.Black {
    return this._currentPlayer
  }

  set currentPlayer(value: color.White | color.Black) {
    this._currentPlayer = value
  }

  get board(): Board {
    return this._board
  }

  get isGameOn(): boolean {
    return this._isGameOn
  }

  set gameStatus(value: gameStatusType) {
    this._gameStatus = value
  }

  get gameStatus(): gameStatusType {
    return this._gameStatus
  }

  protected setupFigures(): void {
    const letters = "abcdefgh" // Corrected to include 'h'

    // Place White Pawns
    for (let i = 0; i < 8; i++) {
      const position = this._board.getPositionByNotation(letters[i] + "2")
      if (position) {
        this._board.addFigureAtPosition(position, new Pawn(color.White, position, this._board))
      }
    }

    // Place White Major Pieces
    this._board.addFigureAtPosition(this._board.getPositionByNotation("a1")!, new Rook(color.White, this._board.getPositionByNotation("a1")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("h1")!, new Rook(color.White, this._board.getPositionByNotation("h1")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("b1")!, new Knight(color.White, this._board.getPositionByNotation("b1")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("g1")!, new Knight(color.White, this._board.getPositionByNotation("g1")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("c1")!, new Bishop(color.White, this._board.getPositionByNotation("c1")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("f1")!, new Bishop(color.White, this._board.getPositionByNotation("f1")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("d1")!, new Queen(color.White, this._board.getPositionByNotation("d1")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("e1")!, new King(color.White, this._board.getPositionByNotation("e1")!, this._board))

    // Place Black Pawns
    for (let i = 0; i < 8; i++) {
      const position = this._board.getPositionByNotation(letters[i] + "7")
      if (position) {
        this._board.addFigureAtPosition(position, new Pawn(color.Black, position, this._board))
      }
    }

    // Place Black Major Pieces
    this._board.addFigureAtPosition(this._board.getPositionByNotation("a8")!, new Rook(color.Black, this._board.getPositionByNotation("a8")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("h8")!, new Rook(color.Black, this._board.getPositionByNotation("h8")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("b8")!, new Knight(color.Black, this._board.getPositionByNotation("b8")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("g8")!, new Knight(color.Black, this._board.getPositionByNotation("g8")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("c8")!, new Bishop(color.Black, this._board.getPositionByNotation("c8")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("f8")!, new Bishop(color.Black, this._board.getPositionByNotation("f8")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("d8")!, new Queen(color.Black, this._board.getPositionByNotation("d8")!, this._board))
    this._board.addFigureAtPosition(this._board.getPositionByNotation("e8")!, new King(color.Black, this._board.getPositionByNotation("e8")!, this._board))

    console.log(this.board.getBoardArray())
    console.trace()
  }

  get awaitingPromotion(): boolean {
    return this._awaitingPromotion
  }
}

export default ChessGame
