import Board from "./board/board";
/**
 * Main class for the backend. Here we will implement any NON-changable logic.<br>
 * In order to change a logic for a certain gamemode or simply game, please use "ChessGame.ts"<br>
 * Here all logic will be implemented
 *
 * @TODO <ul>
 *     <li> Update method need to call awaitPlayer()
 *     <li> Game needs to swap between Player1 and Player2 and allow them to move only their own piece
 *     <li> all methods besides start and update. I took inspiration from GodotEngine with the names and structure of the methods. Consider doing the same.
 *       <li> Methods to check for: mate, pat, check and draw
 *       </ul>
 * */
class ChessEngine {
    private _board: any;
    constructor() {
        this.start()

        this.update()
    }
    /**
     * This method will be called four times in the first frame.<br>
     * It needs to check if it didn't allocate nemory few times for the same thing - because it is being called few times
     * , and this method is used to allocate and declare all variables and memory<br>
     * I think it should be called few times before the game, in case something goes wrong and e.g faills to allocate memory or player id*/
    public start(){
        this._board = new Board();
    }
    /**
     * This method will be called every "playerInput" action. It will proceed with regenerating and updating
     * frontend data e.g board figures position on the screen, and after all of it is done, it should
     * call awaitPlayer() so it waits for another input, instead of being called every frame. To save on computing cost and energy
     * @TODO <ul>
     *     <li> method awaitPlayer() - to wait for each player actions.
     *     <li> main game loop
     *     </ul>
     * */
    public update(){
        this.checkForMate();
        this._board.printBoard();
    }
    /**
     * @todo implement logic for checking for mate
     * */
    private checkForMate() {
        return;
    }
}

export default ChessEngine;