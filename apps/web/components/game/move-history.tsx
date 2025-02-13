export function MoveHistory() {
  const moves = [
    "1. e4 e5",
    "2. Nf3 Nc6",
    "3. Bb5 a6",
    "4. Ba4 Nf6",
    "5. O-O Be7",
    "6. Re1 b5",
    "7. Bb3 d6",
    "8. c3 O-O",
    "9. h3 Na5",
    "10. Bc2 c5",
  ]

  return (
    <div className="bg-gray-800 rounded-lg p-4 w-64 h-[600px] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Move History</h2>
      <div className="space-y-2">
        {moves.map((move, index) => (
          <div key={index} className="flex">
            <span className="w-12 text-gray-400">{index + 1}.</span>
            <span>{move}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

