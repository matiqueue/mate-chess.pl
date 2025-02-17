import { Move } from "@shared/types/moveType"
import Figure from "@modules/chess/figure/figure"

class MoveRecord {
  private _move: Move
  private _figurePerforming: Figure
  private _figureCaptured: Figure | null
  private _wasFirstMove: boolean

  constructor(move: Move, figurePerforming: Figure, figureCaptured: Figure | null, wasFirstMove: boolean) {
    this._move = move
    this._figurePerforming = figurePerforming
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

  get figurePerforming(): Figure {
    return this._figurePerforming
  }

  set figurePerforming(value: Figure) {
    this._figurePerforming = value
  }
}

export default MoveRecord
