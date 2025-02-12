import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"

export function PlayerInfo() {
  return (
    <div className="w-full py-6 px-8">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 border-2 border-white/20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>MK</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-lg text-white">MaxiKing</p>
            <p className="text-sm text-white/70">Playing as White</p>
          </div>
          <div className="ml-8 text-3xl font-mono bg-white/5 px-4 py-2 rounded-lg text-white">0:39</div>
        </div>
        <div className="text-3xl font-bold px-4 text-purple-400">VS</div>
        <div className="flex items-center gap-4">
          <div className="mr-8 text-3xl font-mono bg-white/5 px-4 py-2 rounded-lg text-white">0:55</div>
          <div className="text-right">
            <p className="font-medium text-lg text-white">Aurora</p>
            <p className="text-sm text-white/70">Playing as Black</p>
          </div>
          <Avatar className="w-12 h-12 border-2 border-white/20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}

