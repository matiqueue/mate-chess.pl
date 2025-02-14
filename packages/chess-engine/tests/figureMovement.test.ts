import { Board } from "@utils/boardUtils"
import { Pawn, Rook, Knight, Bishop, Queen, King } from "@utils/figureUtils"
import color from "@chesstypes/colorType"
import Move from "@chesstypes/moveType"

describe("Chess Pieces Movement", () => {
  let board: Board

  beforeEach(() => {
    board = new Board()
    board.setupBoard()
  })

  // 🩸 Pawn Movement
  test("Pawn can move forward one space", () => {
    const move: Move = {
      from: board.getPositionByNotation("e2")!,
      to: board.getPositionByNotation("e3")!,
    }
    expect(board.moveFigure(move)).toBe(true)
  })

  test("Pawn can move forward two spaces on first move", () => {
    const move: Move = {
      from: board.getPositionByNotation("e2")!,
      to: board.getPositionByNotation("e4")!,
    }
    expect(board.moveFigure(move)).toBe(true)
  })

  test("Pawn cannot move forward two spaces after first move", () => {
    const firstMove: Move = {
      from: board.getPositionByNotation("e2")!,
      to: board.getPositionByNotation("e4")!,
    }
    board.moveFigure(firstMove)

    const secondMove: Move = {
      from: board.getPositionByNotation("e4")!,
      to: board.getPositionByNotation("e6")!,
    }
    expect(board.moveFigure(secondMove)).toBe(false)
  })

  test("Pawn can capture diagonally", () => {
    const enemyPawn = new Pawn(color.Black, board.getPositionByNotation("d3")!, board)
    board.addFigureAtPosition(board.getPositionByNotation("d3")!, enemyPawn)

    const move: Move = {
      from: board.getPositionByNotation("e2")!,
      to: board.getPositionByNotation("d3")!,
    }
    expect(board.moveFigure(move)).toBe(true)
  })

  test("Pawn cannot capture forward", () => {
    const enemyPawn = new Pawn(color.Black, board.getPositionByNotation("e3")!, board)
    board.addFigureAtPosition(board.getPositionByNotation("e3")!, enemyPawn)

    const move: Move = {
      from: board.getPositionByNotation("e2")!,
      to: board.getPositionByNotation("e3")!,
    }
    expect(board.moveFigure(move)).toBe(false)
  })

  // 🏇 Knight Movement
  test("Knight can move in 'L' shape", () => {
    const move: Move = {
      from: board.getPositionByNotation("b1")!,
      to: board.getPositionByNotation("c3")!,
    }
    expect(board.moveFigure(move)).toBe(true)
  })

  test("Knight cannot move in straight line", () => {
    const move: Move = {
      from: board.getPositionByNotation("b1")!,
      to: board.getPositionByNotation("b3")!,
    }
    expect(board.moveFigure(move)).toBe(false)
  })

  // ♗ Bishop Movement
  test("Bishop can move diagonally", () => {
    const bishop = new Bishop(color.White, board.getPositionByNotation("c1")!, board)
    board.addFigureAtPosition(board.getPositionByNotation("c1")!, bishop)

    const move: Move = {
      from: board.getPositionByNotation("c1")!,
      to: board.getPositionByNotation("f4")!,
    }
    expect(board.moveFigure(move)).toBe(true)
  })

  test("Bishop cannot move in a straight line", () => {
    const move: Move = {
      from: board.getPositionByNotation("c1")!,
      to: board.getPositionByNotation("c4")!,
    }
    expect(board.moveFigure(move)).toBe(false)
  })

  // 🏰 Rook Movement
  test("Rook can move straight", () => {
    const move: Move = {
      from: board.getPositionByNotation("a1")!,
      to: board.getPositionByNotation("a5")!,
    }
    expect(board.moveFigure(move)).toBe(true)
  })

  test("Rook cannot move diagonally", () => {
    const move: Move = {
      from: board.getPositionByNotation("a1")!,
      to: board.getPositionByNotation("c3")!,
    }
    expect(board.moveFigure(move)).toBe(false)
  })

  // 👑 Queen Movement
  test("Queen can move diagonally", () => {
    const move: Move = {
      from: board.getPositionByNotation("d1")!,
      to: board.getPositionByNotation("h5")!,
    }
    expect(board.moveFigure(move)).toBe(true)
  })

  test("Queen can move straight", () => {
    const move: Move = {
      from: board.getPositionByNotation("d1")!,
      to: board.getPositionByNotation("d4")!,
    }
    expect(board.moveFigure(move)).toBe(true)
  })

  test("Queen cannot move in an invalid pattern", () => {
    const move: Move = {
      from: board.getPositionByNotation("d1")!,
      to: board.getPositionByNotation("e3")!,
    }
    expect(board.moveFigure(move)).toBe(false)
  })

  // 🤴 King Movement
  test("King can move one square in any direction", () => {
    const move: Move = {
      from: board.getPositionByNotation("e1")!,
      to: board.getPositionByNotation("e2")!,
    }
    expect(board.moveFigure(move)).toBe(true)
  })

  test("King cannot move more than one square", () => {
    const move: Move = {
      from: board.getPositionByNotation("e1")!,
      to: board.getPositionByNotation("e3")!,
    }
    expect(board.moveFigure(move)).toBe(false)
  })

  test("King cannot move into check", () => {
    const enemyRook = new Rook(color.Black, board.getPositionByNotation("e8")!, board)
    board.addFigureAtPosition(board.getPositionByNotation("e8")!, enemyRook)

    const move: Move = {
      from: board.getPositionByNotation("e1")!,
      to: board.getPositionByNotation("e2")!,
    }

    expect(board.moveFigure(move)).toBe(false)
  })

  test("King can castle", () => {
    const move: Move = {
      from: board.getPositionByNotation("e1")!,
      to: board.getPositionByNotation("g1")!,
    }
    expect(board.moveFigure(move)).toBe(true)
  })

  test("King cannot castle if in check", () => {
    const enemyRook = new Rook(color.Black, board.getPositionByNotation("e8")!, board)
    board.addFigureAtPosition(board.getPositionByNotation("e8")!, enemyRook)

    const move: Move = {
      from: board.getPositionByNotation("e1")!,
      to: board.getPositionByNotation("g1")!,
    }

    expect(board.moveFigure(move)).toBe(false)
  })
})
