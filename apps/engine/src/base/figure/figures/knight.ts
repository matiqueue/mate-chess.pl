import Figure from "../figure";
import Position from "../../position";

class Knight extends Figure {
    constructor(color: "white" | "black", position: Position) {
        super("knight", color, position);
    }
    isValidMove(target: Position): boolean {
        if (Math.abs(target.x - this.position.x) === 2 && Math.abs(target.y - this.position.y) === 1){
            return true;
        }
        return false;
    }
    move(target: Position): boolean {
        return super.move(target);
    }
}

export default Knight;