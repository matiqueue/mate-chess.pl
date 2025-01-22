import Figure from "../Figure";
import Position from "../../Position";

class Rook extends Figure {
    constructor(color: "white" | "black", position: Position) {
        super("rook", color, position);
    }

    isValidMove(target: Position): boolean {
        if (this.position.x === target.x || this.position.y === target.y){
            return true;
        }
        return false;
    }
    move(target: Position): boolean {
        return super.move(target);
    }
}

export default Rook;