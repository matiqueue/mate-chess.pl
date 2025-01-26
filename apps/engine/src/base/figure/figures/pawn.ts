import Figure from "../figure"
import Position from "../../position"

class Pawn extends Figure {
    private _isFirstMove: boolean
    constructor(color: "white" | "black", position: Position) {
        super("pawn", color, position)
        this._isFirstMove = true
    }

    isValidMove(target: Position): boolean {
        switch (this.color) {
            case "black":
                //standard fwd
                if (target.x === this.position.x && target.y === this.position.y + 1) {
                    return true
                }
                //standard attack
                if (target.figure && Math.abs(target.x - this.position.x) === 1 && target.y === this.position.y + 1) {
                    return true
                }
                //first pawn move fwd
                if (this._isFirstMove && target.x === this.position.x && target.y === this.position.y + 2) {
                    return true
                }
                return false
            case "white":
                //standard fwd
                if (target.x === this.position.x && target.y === this.position.y - 1) {
                    return true
                }
                //standard attack
                if (target.figure && Math.abs(target.x - this.position.x) === 1 && target.y === this.position.y - 1) {
                    return true
                }
                //first pawn move fwd
                if (this._isFirstMove && target.x === this.position.x && target.y === this.position.y - 2) {
                    return true
                }
                return false
        }
    }

    move(target: Position): boolean {
        this._isFirstMove = false
        return super.move(target)
    }
}
export default Pawn
