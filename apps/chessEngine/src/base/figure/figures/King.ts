import Figure from "../Figure";
import Position from "../../Position";

class King extends Figure {
    constructor(color: "white" | "black", position: Position) {
        super("king", color, position);
    }
    isValidMove(target: Position): boolean {
        if (Math.abs(target.x - this.position.x) <= 1 && Math.abs(target.y - this.position.y) <= 1){
            return true;
        }
        return false;
    }
    move(target: Position): boolean {
        return super.move(target);
    }
}

export default King;