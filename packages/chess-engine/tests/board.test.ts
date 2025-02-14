import { King, Rook } from "@utils/figureUtils"
import { Position, Board } from "@utils/boardUtils"
import colorType from "@chesstypes/colorType"
import figureType from "@chesstypes/figureType"
import Move from "@chesstypes/moveType"

describe("Board", () => {
  let board: Board
  let whiteKing: King
  let blackKing: King

  beforeEach(() => {
    board = new Board()
    board.setupBoard()

    const whiteKingPosition = board.getPositionByNotation("e1")!
    const blackKingPosition = board.getPositionByNotation("e8")!

    whiteKing = new King(figureType.king, colorType.White, whiteKingPosition, board)
    blackKing = new King(figureType.king, colorType.Black, blackKingPosition, board)

    board.addFigureAtPosition(whiteKingPosition, whiteKing)
    board.addFigureAtPosition(blackKingPosition, blackKing)
  })

  test("Board initializes correctly with 64 positions", () => {
    expect(board.setupBoard()).toBe(true)
  })

  test("Figures can be added to the board", () => {
    const testPosition = board.getPositionByNotation("d4")!
    const testFigure = new King(figureType.king, colorType.White, testPosition, board)
    expect(board.addFigureAtPosition(testPosition, testFigure)).toBe(true)
  })

  test("Move figure: valid king move", () => {
    const move: Move = {
      from: board.getPositionByNotation("e1")!,
      to: board.getPositionByNotation("e2")!,
    }
    expect(board.moveFigure(move)).toBe(true)
  })

  test("Move figure: invalid move (out of range)", () => {
    const move: Move = {
      from: board.getPositionByNotation("e1")!,
      to: board.getPositionByNotation("e4")!,
    }
    expect(board.moveFigure(move)).toBe(false)
  })

  test("Castling: short castle is valid", () => {
    const whiteRookPos = board.getPositionByNotation("h1")!
    const whiteRook = new Rook(figureType.rook, colorType.White, whiteRookPos, board)
    board.addFigureAtPosition(whiteRookPos, whiteRook)

    const move: Move = {
      from: board.getPositionByNotation("e1")!,
      to: board.getPositionByNotation("g1")!,
    }

    expect(board.moveFigure(move)).toBe(true)
  })

  test("Castling: long castle is valid", () => {
    const whiteRookPos = board.getPositionByNotation("a1")!
    const whiteRook = new Rook(figureType.rook, colorType.White, whiteRookPos, board)
    board.addFigureAtPosition(whiteRookPos, whiteRook)

    const move: Move = {
      from: board.getPositionByNotation("e1")!,
      to: board.getPositionByNotation("c1")!,
    }

    expect(board.moveFigure(move)).toBe(true)
  })

  test("Castling: king already moved", () => {
    whiteKing["hasMoved"] = true

    const move: Move = {
      from: board.getPositionByNotation("e1")!,
      to: board.getPositionByNotation("g1")!,
    }

    expect(board.moveFigure(move)).toBe(false)
  })

  test("Castling: piece between king and rook", () => {
    const whiteRookPos = board.getPositionByNotation("h1")!
    const whiteRook = new Rook(figureType.rook, colorType.White, whiteRookPos, board)
    board.addFigureAtPosition(whiteRookPos, whiteRook)

    // Add a piece between the king and the rook
    const blockerPos = board.getPositionByNotation("f1")!
    board.addFigureAtPosition(blockerPos, new King(figureType.king, colorType.White, blockerPos, board))

    const move: Move = {
      from: board.getPositionByNotation("e1")!,
      to: board.getPositionByNotation("g1")!,
    }

    expect(board.moveFigure(move)).toBe(false)
  })
})
