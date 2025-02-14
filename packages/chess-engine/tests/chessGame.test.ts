import ChessGame from "@modules/chess/chessGame"
import { Board } from "@utils/boardUtils"
import { Pawn, Rook, Knight, Bishop, Queen, King } from "@utils/figureUtils"
import color from "@chesstypes/colorType"

describe("ChessGame", () => {
  let game: ChessGame
  let board: Board

  beforeEach(() => {
    game = new ChessGame()
    board = game["_board"] // Access private board for testing

    // Manually call setupFigures to ensure pieces are placed
    game["setupFigures"]()
  })

  test("Board initializes correctly with 64 positions", () => {
    expect(board.setupBoard()).toBe(true)
    expect(board["positions"].size).toBe(64)
  })

  test("All pieces are placed correctly on the board", () => {
    expect(board.getFigureAtPosition(board.getPositionByNotation("e1")!)).toBeInstanceOf(King)
    expect(board.getFigureAtPosition(board.getPositionByNotation("e8")!)).toBeInstanceOf(King)

    expect(board.getFigureAtPosition(board.getPositionByNotation("d1")!)).toBeInstanceOf(Queen)
    expect(board.getFigureAtPosition(board.getPositionByNotation("d8")!)).toBeInstanceOf(Queen)
  })

  test("Each side has exactly 8 pawns", () => {
    let whitePawns = 0
    let blackPawns = 0

    for (let i = 0; i < 8; i++) {
      if (board.getFigureAtPosition(board.getPositionByNotation(`abcdefgh`[i] + "2")!) instanceof Pawn) {
        whitePawns++
      }
      if (board.getFigureAtPosition(board.getPositionByNotation(`abcdefgh`[i] + "7")!) instanceof Pawn) {
        blackPawns++
      }
    }

    expect(whitePawns).toBe(8)
    expect(blackPawns).toBe(8)
  })

  test("Each side has 2 rooks, 2 knights, and 2 bishops", () => {
    const whiteRooks = [board.getFigureAtPosition(board.getPositionByNotation("a1")!), board.getFigureAtPosition(board.getPositionByNotation("h1")!)]
    const blackRooks = [board.getFigureAtPosition(board.getPositionByNotation("a8")!), board.getFigureAtPosition(board.getPositionByNotation("h8")!)]

    const whiteKnights = [board.getFigureAtPosition(board.getPositionByNotation("b1")!), board.getFigureAtPosition(board.getPositionByNotation("g1")!)]
    const blackKnights = [board.getFigureAtPosition(board.getPositionByNotation("b8")!), board.getFigureAtPosition(board.getPositionByNotation("g8")!)]

    const whiteBishops = [board.getFigureAtPosition(board.getPositionByNotation("c1")!), board.getFigureAtPosition(board.getPositionByNotation("f1")!)]
    const blackBishops = [board.getFigureAtPosition(board.getPositionByNotation("c8")!), board.getFigureAtPosition(board.getPositionByNotation("f8")!)]

    whiteRooks.forEach((rook) => expect(rook).toBeInstanceOf(Rook))
    blackRooks.forEach((rook) => expect(rook).toBeInstanceOf(Rook))
    whiteKnights.forEach((knight) => expect(knight).toBeInstanceOf(Knight))
    blackKnights.forEach((knight) => expect(knight).toBeInstanceOf(Knight))
    whiteBishops.forEach((bishop) => expect(bishop).toBeInstanceOf(Bishop))
    blackBishops.forEach((bishop) => expect(bishop).toBeInstanceOf(Bishop))
  })

  test("No extra pieces are placed", () => {
    let pieceCount = 0

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        // @ts-ignore
        const position = board.getPositionByNotation(`abcdefgh`[x] + (y + 1))
        if (position?.figure) {
          pieceCount++
        }
      }
    }

    expect(pieceCount).toBe(32) // 16 pieces per side
  })
})
