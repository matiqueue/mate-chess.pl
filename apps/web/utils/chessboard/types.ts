export interface Position {
  notation: string
  figure: { type: string; color: string } | null
  rowIndex?: number
  colIndex?: number
}

export interface ArrowData {
  start: Position
  end: Position
}
