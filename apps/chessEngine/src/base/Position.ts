import Figure from "../../../../Duże projekty/mate-chess/apps/engine/src/src/base/figure/Figure";

class Position {
    private _x: number; // Współrzędne x (0-7 dla szachownicy)
    private _y: number; // Współrzędne y (0-7 dla szachownicy)
    private _notation: string; // Notacja szachowa, np. "e8", "a2"
    private _figure: Figure | null; // Figura na pozycji, lub null jeśli brak figury
    private _id: number;

    constructor(x: number, y: number, figure: Figure | null = null, id: number = 0) {
        this._x = x;
        this._y = y;
        this._figure = figure;
        this._notation = this.calculateNotation(x, y);
        this._id = id;
    }

    // Getter i setter dla x
    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
        this._notation = this.calculateNotation(value, this._y);
    }

    // Getter i setter dla y
    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
        this._notation = this.calculateNotation(this._x, value);
    }

    // Getter dla notacji szachowej
    get notation(): string {
        return this._notation;
    }

    // Getter i setter dla figury
    get figure(): Figure | null {
        return this._figure;
    }
    set figure(value: Figure | null) {
        this._figure = value;
    }

    get id(): number {
        return this._id;
    }
    set id(value: number) {
        this._id = value;
    }
    // Prywatna metoda do obliczania notacji szachowej na podstawie współrzędnych
    private calculateNotation(x: number, y: number): string {
        const letters = "abcdefgh"; // Y cords
        const rows = "12345678"; // X cords
        if (x < 0 || x > 7 || y < 0 || y > 7) {
            throw new Error("Współrzędne muszą być w zakresie od 0 do 7.");
        }
        return letters[x] + rows[8 - y];
    }
}

export default Position;