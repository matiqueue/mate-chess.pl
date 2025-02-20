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

export function GameControls() {
  const pathname = usePathname()
  const isLocal = pathname.startsWith("/play/local")
  const isBot = pathname.startsWith("/bot")
  const { theme } = useTheme()
  const { undoMove } = useGameContext() // pobieramy funkcję cofania ruchu

  function confirmSurrender(): import("react").MouseEventHandler<HTMLButtonElement> | undefined {
    throw new Error("Function not implemented.")
  }

  function sendDrawOffer(): import("react").MouseEventHandler<HTMLButtonElement> | undefined {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="w-full py-6 px-8">
      <div className="flex items-center justify-center gap-4 max-w-lg mx-auto">
        {/* Przyciski sterujące (strzałki) widoczne wszędzie */}
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" onClick={undoMove}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
          <ChevronRight className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
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
                  Surrender
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className={`${theme === "dark" ? "bg-background/20 opacity-90" : "bg-background"} backdrop-blur-md shadow-lg`}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to surrender?</AlertDialogTitle>
                  <AlertDialogDescription>If you surrender, your opponent will win the game immediately. This action cannot be undone!</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmSurrender}>Confirm Surrender</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Przycisk "Offer Draw" wyświetlamy tylko, gdy nie jesteśmy na stronie /bot */}
            {!isBot && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-blue-400 border-blue-400/50 hover:bg-blue-400/10">
                    <Handshake className="h-4 w-4 mr-2" />
                    Offer Draw
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className={`${theme === "dark" ? "bg-background/20 opacity-90" : "bg-background"} backdrop-blur-md shadow-lg`}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Do you want to offer a draw?</AlertDialogTitle>
                    <AlertDialogDescription>
                      If your opponent accepts, the game will end in a draw. If they decline, the game will continue.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={sendDrawOffer}>Send Offer</AlertDialogAction>
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
