import ChessAi from "@modules/ai/engine"
import { color } from "@shared/types/colorType"

class ChessGameExtraAI extends ChessAi {
  constructor(aiColor: color, level: number) {
    super(aiColor, level)
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
export default ChessGameExtraAI
