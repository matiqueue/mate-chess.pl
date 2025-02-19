"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { useTheme } from "next-themes"
import { useGameContext } from "@/contexts/GameContext"
import { useUser } from "@clerk/nextjs"

export function PlayerInfo() {
  const { theme } = useTheme()
  const { currentPlayer } = useGameContext()
  const { user, isSignedIn } = useUser()

  const textColor = theme === "dark" ? "text-white" : "text-zinc-900"
  const mutedTextColor = theme === "dark" ? "text-white/60" : "text-zinc-600"
  const timerBg = theme === "dark" ? "bg-zinc-800" : "bg-white/50"

  // Ustawienia dla pierwszego użytkownika
  const firstUserImage = isSignedIn && user?.imageUrl ? user.imageUrl : "https://banner2.cleanpng.com/20180603/jx/avomq8xby.webp"
  const firstUserFallback = isSignedIn && user?.firstName ? user.firstName.slice(0, 2).toUpperCase() : "GU"
  const firstUserName = isSignedIn && user?.firstName ? user.firstName : "Guest"

  // Dane dla drugiego użytkownika – zawsze Guest
  const secondUserImage = "https://banner2.cleanpng.com/20180603/jx/avomq8xby.webp"
  const secondUserFallback = "GU"
  const secondUserName = "Guest"

  // Jeśli currentPlayer jest dostępny, wyświetlamy go, w przeciwnym razie "White"
  const currentTurn = currentPlayer ?? "White"

  return (
    <div className="w-full py-6 px-8 z-10">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          {/* Pierwszy użytkownik: używamy danych z useUser */}
          <Avatar className="w-12 h-12 border-2 border-white/20">
            <AvatarImage src={firstUserImage} />
            <AvatarFallback>{firstUserFallback}</AvatarFallback>
          </Avatar>
          <div>
            <p className={`font-medium text-lg ${textColor}`}>{firstUserName}</p>
            <p className={`text-sm ${mutedTextColor}`}>Playing as White</p>
          </div>
          <div className={`ml-8 text-3xl font-mono ${timerBg} px-4 py-2 rounded-lg ${textColor}`}>0:39</div>
        </div>
        <div className={`text-3xl font-bold px-4 ${textColor}`}>VS</div>
        <div className="flex items-center gap-4">
          <div className={`mr-8 text-3xl font-mono ${timerBg} px-4 py-2 rounded-lg ${textColor}`}>0:55</div>
          <div className="text-right">
            <p className={`font-medium text-lg ${textColor}`}>{secondUserName}</p>
            <p className={`text-sm ${mutedTextColor}`}>Playing as Black</p>
          </div>
          <Avatar className="w-12 h-12 border-2 border-white/20">
            <AvatarImage src={secondUserImage} />
            <AvatarFallback>{secondUserFallback}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className={`text-center font-medium bg-background/30 py-2 mb-[1%] mt-[2%] rounded-lg max-w-xs mx-auto border`}>
        Current turn: <span className="font-bold">{currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1).toLowerCase()}</span>
      </div>
    </div>
  )
}
