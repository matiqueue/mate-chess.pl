import Board from "./board/board"
import Position from "./position"
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
    protected _board: any
    constructor() {
        for (let i = 0; i < 1; i++) {
            this.start()
        }
        this.update()
    }
    /**
     * This method will be called four times in the first frame.<br>
     * It needs to check if it didn't allocate nemory few times for the same thing - because it is being called few times
     * , and this method is used to allocate and declare all variables and memory<br>
     * I think it should be called few times before the game, in case something goes wrong and e.g faills to allocate memory or player id*/
    public start() {
        if (!this._board) {
            this._board = new Board()
        }
        this._board.setupBoard()
        this._board.setupFigures()
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
    public update(): void {
        // this._board.update() //nonexistent right now
        this.checkForCheck()
        if (this.checkForMate()) {
            this.onGameOver()
            return
        }

        // const { from, to } = await this.awaitPlayer()

        // this.awaitPlayer()
        return //instead of await player
        this.update()
    }
    public customFigureSetup() {
        console.log("customFigureSetup called. Clearing the chessboard.")
        this._board.positions.forEach((position: Position) => {
            position.figure = null
        })
    }
    private checkForCheck() {
        return
    }
    /**
     * @todo implement logic for checking for mate
     * */
    private checkForMate(): boolean {
        return false
    }
    /**
     * @warning need to look into promises to make sure this code is sufficient
     * AI GENERATED CODE
     * @todo implement logic for awaiting the player actions
     * */
    // private async awaitPlayer(): Promise<{ from: String; to: String }> {
    //     return new Promise((resolve) => {
    //         // Nasłuchiwanie ruchu gracza, np. przez callback lub event
    //         const onPlayerMove = (move: { from: string; to: string }) => {
    //             // Tutaj możesz dodać walidację ruchu, jeśli chcesz
    //             resolve(move)
    //         }
    //     })
    // }
    private onGameOver() {}
}

export default ChessEngine
