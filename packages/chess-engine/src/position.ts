/**
 * Reprezentuje pojedyncze pole na planszy.
 */
export default class Position {
  public index: number
  public figure: string | null = null

  constructor(index: number) {
    this.index = index
  }
}
