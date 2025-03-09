import { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { useTheme } from "next-themes"
import { useGameContext } from "@/contexts/GameContext"
import { gameStatusType } from "@shared/types/gameStatusType"

export const GameStatusPopupDialog = () => {
  const { theme } = useTheme()
  const { gameStatus } = useGameContext()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if ([gameStatusType.blackWins, gameStatusType.whiteWins, gameStatusType.stalemate].includes(gameStatus)) {
      setOpen(true)
    }
  }, [gameStatus])

  const getDialogContent = () => {
    switch (gameStatus) {
      case gameStatusType.blackWins:
        return "Czarne wygrywają!"
      case gameStatusType.whiteWins:
        return "Białe wygrywają!"
      case gameStatusType.stalemate:
        return "Pat! Remis."
      default:
        return ""
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className={`${theme === "dark" ? "bg-background/20 opacity-90" : "bg-background"} backdrop-blur-md shadow-lg`}>
        <AlertDialogHeader>
          <AlertDialogTitle>Koniec gry</AlertDialogTitle>
          <AlertDialogDescription>{getDialogContent()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Zamknij</AlertDialogCancel>
          <Button variant="default">Nowa gra</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
