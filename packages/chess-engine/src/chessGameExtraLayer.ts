import ChessGame from "@modules/chess/chessGame"

class ChessGameExtraLayer extends ChessGame {
  constructor() {
    super()
  }

  public override start() {
    super.start()
  }

  public override async process() {
    await super.process()
  }

  public override setupFigures() {
    super.setupFigures()
  }
}
export default ChessGameExtraLayer
