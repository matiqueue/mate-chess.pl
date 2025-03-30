"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

// Importy bibliotek i komponentów
import { useEffect, useState } from "react" // Hooki React do efektów i stanu
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog" // Komponenty dialogu ostrzegawczego
import { Button } from "@workspace/ui/components/button" // Komponent przycisku UI
import { useTheme } from "next-themes" // Hook do zarządzania motywem
import { useGameContext } from "@/contexts/GameContext" // Kontekst gry szachowej
import { gameStatusType } from "@shared/types/gameStatusType" // Typy statusu gry
import { useRouter } from "next/navigation" // Hook do programowej nawigacji w Next.js

/**
 * GameStatusPopupDialog
 *
 * Komponent dialogu ostrzegawczego wyświetlający status zakończenia gry szachowej.
 * Pojawia się, gdy gra kończy się wygraną, remisem lub upływem czasu.
 *
 * @returns {JSX.Element} Element JSX reprezentujący dialog statusu gry.
 *
 * @remarks
 * Komponent monitoruje stan gry i czas za pomocą kontekstu gry, otwierając się automatycznie
 * w odpowiednich sytuacjach. Stylizacja dostosowuje się do motywu (jasny/ciemny) z efektem rozmycia tła.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export const GameStatusPopupDialog = () => {
  const { theme } = useTheme() // Hook do pobierania aktualnego motywu
  const { gameStatus, whiteTime, blackTime } = useGameContext() // Dane gry z kontekstu
  const [open, setOpen] = useState(false) // Stan otwarcia dialogu
  const router = useRouter() // Hook do nawigacji

  // Efekt otwierający dialog przy zakończeniu gry lub upływie czasu
  useEffect(() => {
    if ([gameStatusType.blackWins, gameStatusType.whiteWins, gameStatusType.stalemate].includes(gameStatus) || whiteTime <= 0 || blackTime <= 0) {
      setOpen(true) // Otwarcie dialogu w przypadku wygranej, remisu lub końca czasu
    }
  }, [gameStatus, whiteTime, blackTime]) // Uruchamia się przy zmianie statusu gry lub czasu

  /**
   * getDialogContent
   *
   * Funkcja zwracająca treść dialogu w zależności od statusu gry lub upływu czasu.
   *
   * @returns {string} Tekst opisujący wynik gry.
   */
  const getDialogContent = () => {
    switch (gameStatus) {
      case gameStatusType.blackWins:
        return "Czarne wygrywają!" // Wygrana czarnych
      case gameStatusType.whiteWins:
        return "Białe wygrywają!" // Wygrana białych
      case gameStatusType.stalemate:
        return "Pat! Remis." // Remis przez pat
      default:
        if (whiteTime <= 0 || blackTime <= 0) {
          return "Koniec czasu" // Upływ czasu
        } else {
          return "" // Domyślny pusty ciąg (nie powinien wystąpić)
        }
    }
  }

  // Renderowanie dialogu
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className={`${theme === "dark" ? "bg-background/20 opacity-90" : "bg-background"} backdrop-blur-md shadow-lg`}>
        <AlertDialogHeader>
          <AlertDialogTitle>Koniec gry</AlertDialogTitle> {/* Tytuł dialogu */}
          <AlertDialogDescription>{getDialogContent()}</AlertDialogDescription> {/* Treść zależna od statusu */}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Zamknij</AlertDialogCancel> {/* Przycisk zamknięcia dialogu */}
          <Button
            variant="default"
            onClick={() => {
              router.push("/home") // Przekierowanie do lobby
            }}
          >
            Powrót do lobby
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
