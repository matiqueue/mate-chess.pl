import { King, Pawn } from "@utils/figureUtils"
import { Position, Board } from "@utils/boardUtils"
import { color } from "@shared/types/colorType"
import { figureType } from "@shared/types/figureType"

describe("King", () => {
  let board: Board
  let king: King
  let whiteKingPosition: Position
  let blackKingPosition: Position

  beforeEach(() => {
    board = new Board()
    board.setupBoard()

    whiteKingPosition = board.getPositionByNotation("e1")!
    blackKingPosition = board.getPositionByNotation("e8")!

    king = new King(color.White, whiteKingPosition, board)
    board.addFigureAtPosition(whiteKingPosition, king)
  })

  test("King can move one square in any direction", () => {
    const targetPos = board.getPositionByNotation("d1")!
    expect(king.isPositionValid(targetPos)).toBe(true)
  })

  test("King cannot move more than one square", () => {
    const targetPos = board.getPositionByNotation("e3")!
    expect(king.isPositionValid(targetPos)).toBe(false)
  })

  test("King cannot move onto a piece of the same color", () => {
    const targetPos = board.getPositionByNotation("d1")!
    board.addFigureAtPosition(targetPos, new King(color.White, targetPos, board))
    expect(king.isMoveValid(targetPos)).toBe(false)
  })

  test("King recognizes its starting position correctly", () => {
    expect(king["hasMoved"]).toBe(false)
  })

  test("King should not allow movement to check", () => {
    const opponentRookPos = board.getPositionByNotation("e8")!
    board.addFigureAtPosition(opponentRookPos, new King(color.Black, opponentRookPos, board))

    const opponentPawn = board.getPositionByNotation("d3")!
    expect(board.addFigureAtPosition(opponentPawn, new Pawn(color.Black, opponentPawn, board))).toBe(true)
    const moveTarget = board.getPositionByNotation("e2")!

    expect(board.getFigureAtPosition(opponentPawn)?.isPositionValid(moveTarget)).toBe(true)
    expect(king.isMoveValid(moveTarget)).toBe(false)
  })
})
