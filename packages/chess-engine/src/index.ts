import { startGame } from "@/shared/rootFunctions"
import { printFigures, printBoard, printCords, printIds } from "@/shared/utilities/boardPrinter"
import { makeMove } from "@/shared/moveFunctions/moveExecution"
import { isMoveValid } from "@/shared/moveFunctions/moveValidation"
import { castleMove } from "@/shared/specialMovesFunctions/castlingFunctions"
import { enPassantMove } from "@/shared/specialMovesFunctions/enPassantFunctions"
import ChessGame from "@/chessGame"

const game = new ChessGame()

export { startGame, printCords, printIds, printFigures, printBoard, isMoveValid, makeMove, castleMove, enPassantMove }
