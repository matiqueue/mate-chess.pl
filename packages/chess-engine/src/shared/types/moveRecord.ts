import { Move } from "@shared/types/moveType"
import Figure from "@modules/chess/figure/figure"

class MoveRecord {
  private _move: Move
  private _figureCaptured: Figure | null

  constructor(move: Move, figureCaptured: Figure | null) {
    this._move = move
    this._figureCaptured = figureCaptured
  }
  get move(): Move {
    return this._move
  }

  set move(value: Move) {
    this._move = value
  }

  get figureCaptured(): Figure | null {
    return this._figureCaptured
  }

  set figureCaptured(value: Figure | null) {
    this._figureCaptured = value
  }
}

export default MoveRecord
