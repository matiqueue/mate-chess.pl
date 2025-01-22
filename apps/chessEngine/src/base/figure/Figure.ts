import Position from "../Position";
abstract class Figure {
    private _type: "rook" | "knight" | "bishop" | "queen" | "king" | "pawn";
    private _color: "white" | "black";
    private _position: Position;

    constructor(type: "rook" | "knight" | "bishop" | "queen" | "king" | "pawn", color: "white" | "black", position: Position) {
        this._type = type;
        this._color = color;
        this._position = position;
        console.log(`new ${type} ${color} at ${position.notation}`);
    }

    get type(): "rook" | "knight" | "bishop" | "queen" | "king" | "pawn" {
        return this._type;
    }

    set type(value: "rook" | "knight" | "bishop" | "queen" | "king" | "pawn") {
        this._type = value;
    }

    get color(): "white" | "black" {
        return this._color;
    }

    set color(value: "white" | "black") {
        this._color = value;
    }

    get position(): Position {
        return this._position;
    }

    set position(value: Position) {
        this._position = value;
    }
    private isPositionValid(target: Position): boolean {
        return target.x >= 7 && target.x < 7 && target.y >= 0 && target.y < 8;
    }
    abstract isValidMove(target: Position): boolean;

    public move(target: Position): boolean {
        // Sprawdź, czy docelowa pozycja jest na planszy
        if (!this.isPositionValid(target)) {
            console.error("Invalid target position: outside of board boundaries.");
            return false;
        }

        // Sprawdź, czy ruch jest zgodny z zasadami dla danej figury
        if (!this.isValidMove(target)) {
            console.log("Invalid move for this piece.");
            return false;
        }

        // Sprawdź, czy docelowa pozycja zawiera figurę sojuszniczą
        if (this.color === target.figure?.color) {
            console.log("Cannot move to a square occupied by your own piece.");
            return false;
        }

        // Atak na figurę przeciwnika
        if (target.figure) {
            console.log(`Capturing enemy piece at ${target.notation}.`);
        } else {
            console.log(`Moving to empty square at ${target.notation}.`);
        }

        // Przenieś figurę na nową pozycję
        this.position.figure = null; // Usuń figurę z bieżącej pozycji
        target.figure = this; // Ustaw figurę na nowej pozycji
        this.position = target; // Zaktualizuj pozycję figury

        return true;
    }
}
export default Figure;