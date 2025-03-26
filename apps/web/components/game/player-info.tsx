"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { useTheme } from "next-themes"
import { useGameContext } from "@/contexts/GameContext"
import { useUser } from "@clerk/nextjs"
import { useTranslation } from "react-i18next"
import { gameStatusType } from "@shared/types/gameStatusType"

export function PlayerInfo() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { currentPlayer, gameStatus, whiteTime, blackTime } = useGameContext()
  const { user, isSignedIn } = useUser()

  const textColor = theme === "dark" ? "text-white" : "text-zinc-900"
  const mutedTextColor = theme === "dark" ? "text-white/60" : "text-zinc-600"
  const timerBg = theme === "dark" ? "bg-zinc-800" : "bg-white/50"

  const whiteMinutes = Math.floor(whiteTime / 60)
  const whiteSeconds = whiteTime % 60
  const whiteTimeDisplay = `${whiteMinutes}:${whiteSeconds < 10 ? "0" : ""}${whiteSeconds}`

  const blackMinutes = Math.floor(blackTime / 60)
  const blackSeconds = blackTime % 60
  const blackTimeDisplay = `${blackMinutes}:${blackSeconds < 10 ? "0" : ""}${blackSeconds}`

  const firstUserImage = isSignedIn && user?.imageUrl ? user.imageUrl : "https://banner2.cleanpng.com/20180603/jx/avomq8xby.webp"
  const firstUserFallback = isSignedIn && user?.firstName ? user.firstName.slice(0, 2).toUpperCase() : "GU"
  const firstUserName = isSignedIn && user?.firstName ? user.firstName : t("playerInfo.guest")

  const secondUserImage = "https://banner2.cleanpng.com/20180603/jx/avomq8xby.webp"
  const secondUserFallback = "GU"
  const secondUserName = t("playerInfo.guest")

  const currentTurn = currentPlayer ? t(`playerInfo.${currentPlayer.toLowerCase()}`) : t("playerInfo.white")

  return (
    <div className="w-full py-6 px-8 z-10">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 border-2 border-white/20">
            <AvatarImage src={firstUserImage} />
            <AvatarFallback>{firstUserFallback}</AvatarFallback>
          </Avatar>
          <div>
            <p className={`font-medium text-lg ${textColor}`}>{firstUserName}</p>
            <p className={`text-sm ${mutedTextColor}`}>{t("playerInfo.playingWhite")}</p>
          </div>
          <div className={`ml-8 text-3xl font-mono ${timerBg} px-4 py-2 rounded-lg ${textColor}`}>{whiteTimeDisplay}</div>
        </div>
        <div className={`text-3xl font-bold px-4 ${textColor}`}>VS</div>
        <div className="flex items-center gap-4">
          <div className={`mr-8 text-3xl font-mono ${timerBg} px-4 py-2 rounded-lg ${textColor}`}>{blackTimeDisplay}</div>
          <div className="text-right">
            <p className={`font-medium text-lg ${textColor}`}>{secondUserName}</p>
            <p className={`text-sm ${mutedTextColor}`}>{t("playerInfo.playingBlack")}</p>
          </div>
          <Avatar className="w-12 h-12 border-2 border-white/20">
            <AvatarImage src={secondUserImage} />
            <AvatarFallback>{secondUserFallback}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className={`text-center font-medium bg-background/30 py-2 mb-[1%] mt-[2%] rounded-lg max-w-xs mx-auto border`}>
        {gameStatus === "draw"
          ? "Remis"
          : gameStatus === gameStatusType.whiteWins
            ? "Biały wygrał"
            : gameStatus === gameStatusType.blackWins
              ? "Czarny wygrał"
              : `${t("playerInfo.currentTurn")}: ${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1).toLowerCase()}`}
      </div>
    </div>
  )
}
