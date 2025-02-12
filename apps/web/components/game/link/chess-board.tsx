export function ChessBoard() {
  return (
    <div className="relative w-screen max-w-[68vh] aspect-square">
      <div className="absolute inset-0 bg-white/5 blur-2xl rounded-3xl" />
      <div className="relative w-full h-full bg-black/50 rounded-xl p-4 shadow-2xl border border-white/20">
        <div className="grid grid-cols-8 grid-rows-8 h-full w-full gap-[1px] bg-white/20 p-[1px]">
          {Array.from({ length: 64 }).map((_, i) => {
            const row = Math.floor(i / 8)
            const col = i % 8
            const isBlack = (row + col) % 2 === 1
            return (
              <div
                key={i}
                className={`${
                  isBlack ? "bg-gray-700" : "bg-gray-300"
                } relative transition-all duration-300 hover:bg-blue-400/30`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

