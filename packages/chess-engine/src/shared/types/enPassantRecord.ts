import MoveRecord from "@shared/types/moveRecord"
import { Move } from "@shared/types/moveType"
import Figure from "@modules/chess/figure/figure"
import Pawn from "@modules/chess/figure/figures/pawn"

class enPassantRecord extends MoveRecord {
  constructor(move: Move, figurePerforming: Pawn, figureCaptured: Pawn) {
    super(move, figurePerforming, figureCaptured, false)
  }
}
export default enPassantRecord
