import { Move } from "@shared/types/moveType"
import Figure from "@modules/chess/figure/figure"

class MoveRecord {
  private _move: Move
  private _figureCaptured: Figure | null
  private _wasFirstMove: boolean

  constructor(move: Move, figureCaptured: Figure | null, wasFirstMove: boolean) {
    this._move = move
    this._figureCaptured = figureCaptured
    this._wasFirstMove = wasFirstMove
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

  get wasFirstMove(): boolean {
    return this._wasFirstMove
  }

  set wasFirstMove(value: boolean) {
    this._wasFirstMove = value
  }
}

export default MoveRecord
