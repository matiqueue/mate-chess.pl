import { Board } from "@utils/boardUtils"
import { Bishop, Figure, King, Knight, Pawn, Queen, Rook } from "@utils/figureUtils"
import { color } from "@shared/types/colorType"
import { Move } from "@shared/types/moveType"
import MoveRecord from "@shared/types/moveRecord"
import MoveRecorder from "@modules/chess/history/moveRecorder"
import { gameStatusType } from "@shared/types/gameStatusType"
import { PromotionFigureType } from "@shared/types/promotionType"

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
  public async process() {
    console.log("processing...")
    this.stateProcessor()

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
  /**
   * I had to add this method because otherwise the AI would crash when its checkmated or there is stalemate*/
  protected stateProcessor() {
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
    const isSuccess = this.board.undoLastMove()
    if (isSuccess) {
      this.switchCurrentPlayer()
    }
    return isSuccess
  }
  /**
   * Regenerates and returns the move history using {@link MoveRecorder}.
   *
   * @returns formatted move history
   */
  public getMoveHistory() {
    return this._moveRecorder.regenerateMoveHistory(this._moves)
  }

  public getMoveHistoryString(): string {
    const moves = this._moveRecorder.regenerateMoveString(this._moves)

    return moves
  }
  public gameDraw() {
    this._gameStatus = gameStatusType.draw
    this._isGameOn = false
  }
  protected switchCurrentPlayer() {
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

  public setupFigures(fenString: String = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"): void {
    // Parse FEN string components
    const fenParts = fenString.split(" ")
    if (fenParts.length < 6) {
      throw new Error("Invalid FEN string: missing required components")
    }

    const [boardStr, activeColor, castleRights, enPassant, halfmove, fullmove] = fenParts

    // Helper function to create figure from FEN notation
    const createFigureFromFEN = (char: string, x: number, y: number): Figure | null => {
      const figColor = char === char.toUpperCase() ? color.Black : color.White
      const position = this._board.getPositionByCords(x, 7 - y)

      if (!position) return null

      switch (char.toLowerCase()) {
        case "k":
          return new King(figColor, position, this._board)
        case "q":
          return new Queen(figColor, position, this._board)
        case "r":
          return new Rook(figColor, position, this._board)
        case "b":
          return new Bishop(figColor, position, this._board)
        case "n":
          return new Knight(figColor, position, this._board)
        case "p":
          return new Pawn(figColor, position, this._board)
        default:
          return null
      }
    }

    // Parse board rows
    let y = 0
    if (!boardStr) {
      console.error("setup figures failed: board string does not exist")
      return
    }
    for (const row of boardStr.split("/")) {
      let x = 0
      for (const char of row) {
        switch (char) {
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
            // Empty squares
            x += parseInt(char)
            break

          default:
            // Place figure
            const figure = createFigureFromFEN(char, x, y)
            if (figure) {
              this._board.addFigureAtPosition(this._board.getPositionByCords(x, 7 - y)!, figure)
            }
            x++
            break
        }
        if (x > 8) break
      }
      if (x !== 8) {
        throw new Error(`Invalid FEN string: row ${y + 1} has incorrect length`)
      }
      y++
    }

    // Validate board state
    if (y !== 8) {
      throw new Error("Invalid FEN string: incorrect number of rows")
    }

    // Set current player
    this.currentPlayer = activeColor === "w" ? color.White : color.Black
  }

  get awaitingPromotion(): boolean {
    return this._awaitingPromotion
  }
}

export default ChessGame
