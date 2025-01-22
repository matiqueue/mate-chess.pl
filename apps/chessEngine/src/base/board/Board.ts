import Position from "../Position";
import Figure from "../figure/Figure";
import Pawn from "../figure/figures/Pawn";
import Rook from "../figure/figures/Rook";
import Knight from "../figure/figures/Knight";
import King from "../figure/figures/King";
import Bishop from "../figure/figures/Bishop";
import Queen from "../figure/figures/Queen";


class Board {
    private positions: Map<string, Position>;
    private letters = "abcdefgh";
    private figures: Figure[];

    constructor() {
        this.positions = new Map();
        this.figures = Array(32)
    }

    // Inicjalizacja pozycji na planszy
    /**DEPRECATED*/
    public init() {
        this.setupBoard();
        this.placeFigures(); //chyba nie działa ? edit: działa :)

        console.log("board initialized")
    }
    private setupBoard() {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const notation = this.letters[x] + (8 - y);
                const position = new Position(x, y);
                this.positions.set(notation, position);
            }
        }
    }
    // Wstawianie figur na szachownicę w standardowej pozycji
    private placeFigures() {
        // Białe figury
        for (let i = 0; i < 8; i++) {
            const position = this.positions.get(this.letters[i] + "2");
            if (position) {
                position.figure = new Pawn("white", position);
            }
        }
        this.positions.get("a1")!.figure = new Rook("white", this.positions.get("a1")!);
        this.positions.get("h1")!.figure = new Rook("white", this.positions.get("h1")!);
        this.positions.get("b1")!.figure = new Knight("white", this.positions.get("b1")!);
        this.positions.get("g1")!.figure = new Knight("white", this.positions.get("g1")!);
        this.positions.get("c1")!.figure = new Bishop("white", this.positions.get("c1")!);
        this.positions.get("f1")!.figure = new Bishop("white", this.positions.get("f1")!);
        this.positions.get("d1")!.figure = new Queen("white", this.positions.get("d1")!);
        this.positions.get("e1")!.figure = new King("white", this.positions.get("e1")!);

        // Czarne figury
        for (let i = 0; i < 8; i++) {
            const position = this.positions.get(this.letters[i] + "7");
            if (position) {
                position.figure = new Pawn("black", position);
            }
        }
        this.positions.get("a8")!.figure = new Rook("black", this.positions.get("a8")!);
        this.positions.get("h8")!.figure = new Rook("black", this.positions.get("h8")!);
        this.positions.get("b8")!.figure = new Knight("black", this.positions.get("b8")!);
        this.positions.get("g8")!.figure = new Knight("black", this.positions.get("g8")!);
        this.positions.get("c8")!.figure = new Bishop("black", this.positions.get("c8")!);
        this.positions.get("f8")!.figure = new Bishop("black", this.positions.get("f8")!);
        this.positions.get("d8")!.figure = new Queen("black", this.positions.get("d8")!);
        this.positions.get("e8")!.figure = new King("black", this.positions.get("e8")!);

        console.log("figures placed on the board.");
    }

    // Wyświetlenie szachownicy w formacie [literka cyferka]
    public printBoard() {
        for (let y = 7; y >= 0; y--) {
            let row = '';
            for (let x = 0; x < 8; x++) {
                const notation = this.letters[x] + (8 - y);
                row += '[' + notation + '] ';
            }
            console.log(row.trim());
        }
    }

    // Wyświetlenie szachownicy z figurami
    public printFigures() {
        for (let y = 7; y >= 0; y--) {
            let row = '';
            for (let x = 0; x < 8; x++) {
                const figure = this.positions.get(this.letters[x] + (8 - y))?.figure?.type;
                row += '[' + (figure) + '] ';
            }
            console.log(row.trim());
        }
    }
    /**DEPRECATED*/
    public update() {
        // Placeholder dla innych operacji na szachownicy
        this.printBoard()
        this.printFigures()
    }
}
export default Board;