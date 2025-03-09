import { useEffect, useState } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@workspace/ui/components/alert-dialog"
import { useTheme } from "next-themes"
import { useGameContext } from "@/contexts/GameContext"

export const PreviewModeAlertPopup = (isOpen: boolean) => {
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setOpen(true)
  }),
    [isOpen]
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className={`${theme === "dark" ? "bg-background/20 opacity-90" : "bg-background"} backdrop-blur-md shadow-lg`}>
        <AlertDialogHeader>
          <AlertDialogTitle>Tryb podglądu</AlertDialogTitle>
          <AlertDialogDescription>
            Plansza znajduje się w trybie podglądu. Aby wykonać ten ruch, plansza zostanie przywrócona do trybu gry
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
