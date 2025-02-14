class MoveRecord {
  private _notation: string
  private _number: number

  constructor(notation: string, number: number) {
    this._notation = notation
    this._number = number
  }

  get notation(): string {
    return this._notation
  }

  set notation(value: string) {
    this._notation = value
  }

  get number(): number {
    return this._number
  }

  set number(value: number) {
    this._number = value
  }
}

export default MoveRecord
