import Figure from "../figure";
import Position from "../../position";

class Queen extends Figure {
    constructor(color: "white" | "black", position: Position) {
        super("queen", color, position);
    }
    isValidMove(target: Position): boolean {
        if (Math.abs(target.x - this.position.x) === Math.abs(target.y - this.position.y) || (this.position.x === target.x || this.position.y === target.y)){
            return true;
        }
        return false;
    }
    move(target: Position): boolean {
        return super.move(target);
    }
}

export default Queen;