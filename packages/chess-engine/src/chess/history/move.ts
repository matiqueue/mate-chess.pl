import { color } from "@shared/types/colorType"

/**
 * Class used to display move records in frontend. Nothing interesting
 * */
class MoveRecordPublic {
  private _playerColor: color
  private _moveString: string
  private _id: number

  constructor(playerColor: color, moveString: string, id: number) {
    this._playerColor = playerColor
    this._moveString = moveString
    this._id = id
  }
  private generateMoveString(): string {
    return ""
  }
  get playerColor(): color {
    return this._playerColor
  }

  get moveString(): string {
    return this._moveString
  }

  get id(): number {
    return this._id
  }
}
export default MoveRecordPublic
