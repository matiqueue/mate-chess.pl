import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { useTheme } from "next-themes"

export function PlayerInfo() {
  const { theme } = useTheme()
  const textColor = theme === "dark" ? "text-white" : "text-zinc-900"
  const mutedTextColor = theme === "dark" ? "text-white/60" : "text-zinc-600"
  const timerBg = theme === "dark" ? "bg-zinc-800" : "bg-white/50"
  const currentTurn = "White"
  return (
    <div className="w-full py-6 px-8">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 border-2 border-white/20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>MK</AvatarFallback>
          </Avatar>
          <div>
            <p className={`font-medium text-lg ${textColor}`}>MaxiKing</p>
            <p className={`text-sm ${mutedTextColor}`}>Playing as White</p>
          </div>
          <div className={`ml-8 text-3xl font-mono ${timerBg} px-4 py-2 rounded-lg ${textColor}`}>0:39</div>
        </div>
        <div className={`text-3xl font-bold px-4 ${textColor}`}>VS</div>
        <div className="flex items-center gap-4">
          <div className={`mr-8 text-3xl font-mono ${timerBg} px-4 py-2 rounded-lg ${textColor}`}>0:55</div>
          <div className="text-right">
            <p className={`font-medium text-lg ${textColor}`}>Aurora</p>
            <p className={`text-sm ${mutedTextColor}`}>Playing as Black</p>
          </div>
          <Avatar className="w-12 h-12 border-2 border-white/20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className={`text-center font-medium bg-background/30 py-2 mb-[1%] mt-[2%] rounded-lg max-w-xs mx-auto border`}>Current turn: {currentTurn}</div>
    </div>
  )
}
