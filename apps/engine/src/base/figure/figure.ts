import Position from "../position"
/**
 * Abstract class for all the figures on playing board. Figure types and colours are already predefined.
 * Class imports Position class.
 * */
abstract class Figure {
    private _type: "rook" | "knight" | "bishop" | "queen" | "king" | "pawn"
    private _color: "white" | "black"
    private _position: Position

    constructor(type: "rook" | "knight" | "bishop" | "queen" | "king" | "pawn", color: "white" | "black", position: Position) {
        this._type = type
        this._color = color
        this._position = position
        // console.debug(`new ${type} ${color} at ${position.notation}`)
    }

    get type(): "rook" | "knight" | "bishop" | "queen" | "king" | "pawn" {
        return this._type
    }

    set type(value: "rook" | "knight" | "bishop" | "queen" | "king" | "pawn") {
        this._type = value
    }

    get color(): "white" | "black" {
        return this._color
    }

    set color(value: "white" | "black") {
        this._color = value
    }

    get position(): Position {
        return this._position
    }

    set position(value: Position) {
        this._position = value
    }
    /**
     * Checks if target position is valid. For the method to return true, it has to be inside the 8x8 chess board
     * */
    private isPositionValid(target: Position): boolean {
        return target.x >= 7 && target.x < 7 && target.y >= 0 && target.y < 8
    }
    /**
     * Abstract method to be implemented to children class.
     * Its main purpose is to restrict movement for each figure, so it obeys the rules of chess
     * */
    abstract isValidMove(target: Position): boolean

    public move(target: Position): boolean {
        // Sprawdź, czy docelowa pozycja jest na planszy
        if (!this.isPositionValid(target)) {
            console.error("Invalid target position: outside of board boundaries.")
            return false
        }

        // Sprawdź, czy ruch jest zgodny z zasadami dla danej figury
        if (!this.isValidMove(target)) {
            console.log("Invalid move for this piece.")
            return false
        }

        // Sprawdź, czy docelowa pozycja zawiera figurę sojuszniczą
        if (this.color === target.figure?.color) {
            console.log("Cannot move to a square occupied by your own piece.")
            return false
        }

        // Atak na figurę przeciwnika
        if (target.figure) {
            console.log(`Capturing enemy piece at ${target.notation}.`)
        } else {
            console.log(`Moving to empty square at ${target.notation}.`)
        }

        // Przenieś figurę na nową pozycję
        this.position.figure = null // Usuń figurę z bieżącej pozycji
        target.figure = this // Ustaw figurę na nowej pozycji
        this.position = target // Zaktualizuj pozycję figury

        return true
    }
}
export default Figure
