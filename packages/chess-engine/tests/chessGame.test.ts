import ChessGame from "@modules/chess/chessGame"
import { Board, Position } from "@utils/boardUtils"
import { Pawn, Rook, Knight, Bishop, Queen, King } from "@utils/figureUtils"
import color from "@chesstypes/colorType"
import Move from "@chesstypes/moveType"

describe("ChessGame", () => {
  let game: ChessGame
  let board: Board

  beforeEach(() => {
    game = new ChessGame()
    board = game["_board"] // Access private board for testing

    // Manually call setupFigures to ensure pieces are placed
    game["setupFigures"]()
    game.isGameOn = true // Manually start the game
  })

  test("Board initializes with 64 positions and all pieces", () => {
    expect(board.setupBoard()).toBe(true)
    expect(board["positions"].size).toBe(64)
    expect(board.getFigureAtPosition(board.getPositionByNotation("e1")!)).toBeInstanceOf(King)
    expect(board.getFigureAtPosition(board.getPositionByNotation("e8")!)).toBeInstanceOf(King)
  })

  test("Game starts with White as the first player", () => {
    expect(game.currentPlayer).toBe(color.White)
  })

  test("Valid pawn move switches the turn", () => {
    const move: Move = {
      from: board.getPositionByNotation("e2")!,
      to: board.getPositionByNotation("e3")!,
    }

    expect(game.makeMove(move)).toBe(true)
    expect(game.currentPlayer).toBe(color.Black)
  })

  test("Invalid move does not switch the turn", () => {
    const move: Move = {
      from: board.getPositionByNotation("e7")!, // Black's pawn
      to: board.getPositionByNotation("e5")!,
    }

    expect(game.makeMove(move)).toBe(false)
    expect(game.currentPlayer).toBe(color.White)
  })

  test("Game prevents moves when isGameOn is false", () => {
    game.isGameOn = false

    const move: Move = {
      from: board.getPositionByNotation("e2")!,
      to: board.getPositionByNotation("e3")!,
    }

    expect(game.makeMove(move)).toBe(false)
    expect(game.currentPlayer).toBe(color.White)
  })

  test("Switching turns works correctly", () => {
    const move1: Move = {
      from: board.getPositionByNotation("e2")!,
      to: board.getPositionByNotation("e3")!,
    }

    const move2: Move = {
      from: board.getPositionByNotation("e7")!,
      to: board.getPositionByNotation("e6")!,
    }

    expect(game.makeMove(move1)).toBe(true)
    expect(game.currentPlayer).toBe(color.Black)

    expect(game.makeMove(move2)).toBe(true)
    expect(game.currentPlayer).toBe(color.White)
  })

  test("Attempting to move an opponent's piece is not allowed", () => {
    const move: Move = {
      from: board.getPositionByNotation("e7")!, // Black's piece, but White's turn
      to: board.getPositionByNotation("e6")!,
    }

    expect(game.makeMove(move)).toBe(false)
    expect(game.currentPlayer).toBe(color.White)
  })

  test("Game prevents illegal moves", () => {
    const move: Move = {
      from: board.getPositionByNotation("e2")!,
      to: board.getPositionByNotation("e5")!, // Pawns can't move two squares after first move
    }

    expect(game.makeMove(move)).toBe(false)
    expect(game.currentPlayer).toBe(color.White)
  })
})
