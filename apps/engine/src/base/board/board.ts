import Position from "../position"
import Figure from "../figure/figure"
import Pawn from "../figure/figures/pawn"
import Rook from "../figure/figures/rook"
import Knight from "../figure/figures/knight"
import King from "../figure/figures/king"
import Bishop from "../figure/figures/bishop"
import Queen from "../figure/figures/queen"

/**
 * Main playing board. very important.<br>
 * Class imports all figures and position.
 * The board consists of 64 individual Positions, which are stored in a "positions" Map.
 * Figures are stored in an array with preallocated 32 indexes, each for one figure
 * constructor only creates a map and allocates memory for arrays.
 * in order to actually create positions, call method setupBoard()
 * */
class Board {
    private positions: Map<string, Position>
    private letters: any = "abcdefgh"
    private figures: Figure[]

    constructor() {
        this.positions = new Map()
        this.figures = Array(32)
    }
    // Inicjalizacja pozycji na planszy
    /**@DEPRECATED*/
    public init() {
        this.setupBoard()
        this.setupFigures() //chyba nie działa ? edit: działa :)

        console.log("board initialized")
    }
    /**
     * Sets up 64 positions in a twodimensional space of 8 height and 8 width. <br>*/
    public setupBoard() {
        let id = 0
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const notation = this.letters[x] + (8 - y)
                const position = new Position(x, y, null, id)
                this.positions.set(notation, position)
                id++
            }
        }
    }
    // Wstawianie figur na szachownicę w standardowej pozycji
    public setupFigures() {
        // Białe figury
        for (let i = 0; i < 8; i++) {
            const position = this.positions.get(this.letters[i] + "2")
            if (position) {
                position.figure = new Pawn("white", position)
            }
        }
        this.positions.get("a1")!.figure = new Rook(
            "white",
            this.positions.get("a1")!,
        )
        this.positions.get("h1")!.figure = new Rook(
            "white",
            this.positions.get("h1")!,
        )
        this.positions.get("b1")!.figure = new Knight(
            "white",
            this.positions.get("b1")!,
        )
        this.positions.get("g1")!.figure = new Knight(
            "white",
            this.positions.get("g1")!,
        )
        this.positions.get("c1")!.figure = new Bishop(
            "white",
            this.positions.get("c1")!,
        )
        this.positions.get("f1")!.figure = new Bishop(
            "white",
            this.positions.get("f1")!,
        )
        this.positions.get("d1")!.figure = new Queen(
            "white",
            this.positions.get("d1")!,
        )
        this.positions.get("e1")!.figure = new King(
            "white",
            this.positions.get("e1")!,
        )

        // Czarne figury
        for (let i = 0; i < 8; i++) {
            const position = this.positions.get(this.letters[i] + "7")
            if (position) {
                position.figure = new Pawn("black", position)
            }
        }
        this.positions.get("a8")!.figure = new Rook(
            "black",
            this.positions.get("a8")!,
        )
        this.positions.get("h8")!.figure = new Rook(
            "black",
            this.positions.get("h8")!,
        )
        this.positions.get("b8")!.figure = new Knight(
            "black",
            this.positions.get("b8")!,
        )
        this.positions.get("g8")!.figure = new Knight(
            "black",
            this.positions.get("g8")!,
        )
        this.positions.get("c8")!.figure = new Bishop(
            "black",
            this.positions.get("c8")!,
        )
        this.positions.get("f8")!.figure = new Bishop(
            "black",
            this.positions.get("f8")!,
        )
        this.positions.get("d8")!.figure = new Queen(
            "black",
            this.positions.get("d8")!,
        )
        this.positions.get("e8")!.figure = new King(
            "black",
            this.positions.get("e8")!,
        )

        console.log("figures placed on the board.")
    }

    // Wyświetlenie szachownicy w formacie [literka cyferka] DEBUG
    public printBoard() {
        for (let y = 7; y >= 0; y--) {
            let row = ""
            for (let x = 0; x < 8; x++) {
                const notation = this.letters[x] + (8 - y)
                row += "[" + notation + "] "
            }
            console.log(row.trim())
        }
    }

    // Wyświetlenie szachownicy z figurami DEBUG
    public printFigures() {
        for (let y = 7; y >= 0; y--) {
            let row = ""
            for (let x = 0; x < 8; x++) {
                const figure = this.positions.get(this.letters[x] + (8 - y))
                    ?.figure?.type
                row += "[" + figure + "] "
            }
            console.log(row.trim())
        }
    }
    public printIds() {
        for (let y = 7; y >= 0; y--) {
            let row = ""
            for (let x = 0; x < 8; x++) {
                const id = this.positions.get(this.letters[x] + (8 - y))?.id
                row += `[${id !== undefined ? id : " "}] `
            }
            console.log(row.trim())
        }
    }

    public getValidMovesForPosition(position: Position) {}

    public getPositionByNotation(notation: string): Position | null {
        const position = this.positions.get(notation)
        if (!position) {
            console.error(`Position "${notation}" does not exist on the board.`)
            return null
        }
        return position
    }

    public getPositionById(id: number): Position | null {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const notation = this.letters[x] + (8 - y)
                const position = this.positions.get(notation)
                if (position?.id === id) {
                    return position
                }
            }
        }
        return null
    }

    public getPositionByCords(
        positionX: number,
        positionY: number,
    ): Position | null {
        return this.getPositionByNotation(
            this.letters[positionX] + positionY.toString(),
        )
    }

    public getFigureAtPosition(position: Position): Figure | null {
        return position.figure || null
    }
}
export default Board
