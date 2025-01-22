import Figure from "../Figure";
import Position from "../../Position";

class Pawn extends Figure {
    private _isFirstMove: boolean;
    constructor(color: "white" | "black", position: Position) {
        super("pawn", color, position);
        this._isFirstMove = true;
    }

    isValidMove(target: Position): boolean {
        if (target.x === this.position.x && Math.abs(target.y - this.position.y) === 1 + Number(this._isFirstMove)){
            return true;
        } //standard pawn move

        return false;
    }

    move(target: Position): boolean {
        this._isFirstMove = false;
        return super.move(target);
    }
}
export default Pawn;