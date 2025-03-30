"use client"

import { Button } from "@workspace/ui/components/button"
import { Flag, Handshake, RotateCcw, FastForward, ChevronLeft, ChevronRight } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useGameContext } from "@/contexts/GameContext"
import { useTranslation } from "react-i18next"
import { gameStatusType } from "@modules/shared/types/gameStatusType"

export function GameControls() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const isLocal = pathname.startsWith("/play/local")
  const isBot = pathname.startsWith("/bot")
  const { theme } = useTheme()
  const { undoLastMove, reviewLastMove, forwardLastMove, returnToCurrentGameState, setGameStatus } = useGameContext() // pobieramy funkcję cofania ruchu

  function confirmSurrender() {
    setGameStatus(gameStatusType.blackWins)
  }

  function sendDrawOffer(): import("react").MouseEventHandler<HTMLButtonElement> | undefined {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="w-full py-6 px-8">
      <div className="flex items-center justify-center gap-4 max-w-lg mx-auto">
        {/* Przyciski sterujące (strzałki) widoczne wszędzie */}
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" onClick={undoLastMove}>
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" onClick={reviewLastMove}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" onClick={forwardLastMove}>
          <ChevronRight className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" onClick={returnToCurrentGameState}>
          <FastForward className="h-5 w-5" />
        </Button>

        {/* Separator wyświetlany tylko, gdy będą widoczne przyciski akcji */}
        {!isLocal && <div className="w-px h-8 bg-white/20 mx-2" />}

        {/* Przyciski akcji */}
        {!isLocal && (
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-400 border-red-400/50 hover:bg-red-400/10">
                  <Flag className="h-4 w-4 mr-2" />
                  {t("gameControls.surrender")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className={`${theme === "dark" ? "bg-background/20 opacity-90" : "bg-background"} backdrop-blur-md shadow-lg`}>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("gameControls.surrenderTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>{t("gameControls.surrenderDescription")}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("gameControls.cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmSurrender}>{t("gameControls.confirmSurrender")}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Przyciski akcji: Offer Draw wyświetlamy tylko, gdy nie jesteśmy na stronie /bot */}
            {!isBot && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-blue-400 border-blue-400/50 hover:bg-blue-400/10">
                    <Handshake className="h-4 w-4 mr-2" />
                    {t("gameControls.offerDraw")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className={`${theme === "dark" ? "bg-background/20 opacity-90" : "bg-background"} backdrop-blur-md shadow-lg`}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("gameControls.offerDrawTitle")}</AlertDialogTitle>
                    <AlertDialogDescription>{t("gameControls.offerDrawDescription")}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("gameControls.cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={sendDrawOffer}>{t("gameControls.sendOffer")}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </>
        )}
      </div>
    </div>
  )
}
