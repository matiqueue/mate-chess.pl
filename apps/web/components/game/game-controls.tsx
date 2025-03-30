"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

// Importy bibliotek i komponentów
import { Button } from "@workspace/ui/components/button" // Komponent przycisku UI
import { Flag, Handshake, RotateCcw, FastForward, ChevronLeft, ChevronRight } from "lucide-react" // Ikony z biblioteki Lucide
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
} from "@workspace/ui/components/alert-dialog" // Komponenty dialogu ostrzegawczego
import { useTheme } from "next-themes" // Hook do zarządzania motywem
import { usePathname } from "next/navigation" // Hook do pobierania aktualnej ścieżki URL
import { useGameContext } from "@/contexts/GameContext" // Kontekst gry szachowej
import { useTranslation } from "react-i18next" // Hook do obsługi tłumaczeń
import { gameStatusType } from "@modules/shared/types/gameStatusType" // Typy statusu gry

/**
 * GameControls
 *
 * Komponent sterowania grą szachową, oferujący przyciski do cofania ruchów, przeglądania historii
 * oraz akcji takich jak poddanie się lub zaproponowanie remisu. Dostosowuje się do trybu gry.
 *
 * @returns {JSX.Element} Element JSX reprezentujący kontrolki gry.
 *
 * @remarks
 * Komponent jest widoczny we wszystkich trybach gry, ale niektóre akcje (np. poddanie się, remisy)
 * są dostępne tylko w grach online lub przez link, a nie w grze lokalnej czy z botem.
 * Stylizacja zależy od motywu (jasny/ciemny).
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export function GameControls() {
  const { t } = useTranslation() // Hook do tłumaczeń
  const pathname = usePathname() // Aktualna ścieżka URL
  const isLocal = pathname.startsWith("/play/local") // Czy gra jest lokalna
  const isBot = pathname.startsWith("/bot") // Czy gra jest z botem
  const { theme } = useTheme() // Hook do pobierania motywu
  const { undoLastMove, reviewLastMove, forwardLastMove, returnToCurrentGameState, setGameStatus } = useGameContext() // Funkcje sterujące grą z kontekstu

  /**
   * confirmSurrender
   *
   * Funkcja potwierdzająca poddanie się, ustawiająca status gry na wygraną czarnych.
   */
  function confirmSurrender() {
    setGameStatus(gameStatusType.blackWins) // Ustawia status gry na wygraną czarnych
  }

  /**
   * sendDrawOffer
   *
   * Funkcja wysyłająca ofertę remisu (jeszcze niewdrożona).
   *
   * @returns {import("react").MouseEventHandler<HTMLButtonElement> | undefined} Handler zdarzenia kliknięcia.
   * @throws {Error} Rzuca błąd, ponieważ funkcja nie jest zaimplementowana.
   */
  function sendDrawOffer(): import("react").MouseEventHandler<HTMLButtonElement> | undefined {
    throw new Error("Function not implemented.") // Rzuca błąd z powodu braku implementacji
  }

  // Renderowanie kontrolek gry
  return (
    <div className="w-full py-6 px-8">
      <div className="flex items-center justify-center gap-4 max-w-lg mx-auto">
        {/* Przyciski sterujące (strzałki) widoczne wszędzie */}
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" onClick={undoLastMove}>
          <RotateCcw className="h-5 w-5" /> {/* Cofnij ostatni ruch */}
        </Button>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" onClick={reviewLastMove}>
          <ChevronLeft className="h-6 w-6" /> {/* Przejrzyj poprzedni ruch */}
        </Button>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" onClick={forwardLastMove}>
          <ChevronRight className="h-6 w-6" /> {/* Przejrzyj następny ruch */}
        </Button>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" onClick={returnToCurrentGameState}>
          <FastForward className="h-5 w-5" /> {/* Wróć do aktualnego stanu gry */}
        </Button>
        {/* Separator wyświetlany tylko, gdy będą widoczne przyciski akcji */}
        {!isLocal && <div className="w-px h-8 bg-white/20 mx-2" />} {/* Separator */}
        {/* Przyciski akcji */}
        {!isLocal && (
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-400 border-red-400/50 hover:bg-red-400/10">
                  <Flag className="h-4 w-4 mr-2" />
                  {t("gameControls.surrender")} {/* Przycisk poddania się */}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className={`${theme === "dark" ? "bg-background/20 opacity-90" : "bg-background"} backdrop-blur-md shadow-lg`}>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("gameControls.surrenderTitle")}</AlertDialogTitle> {/* Tytuł dialogu poddania */}
                  <AlertDialogDescription>{t("gameControls.surrenderDescription")}</AlertDialogDescription> {/* Opis */}
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("gameControls.cancel")}</AlertDialogCancel> {/* Anuluj */}
                  <AlertDialogAction onClick={confirmSurrender}>{t("gameControls.confirmSurrender")}</AlertDialogAction> {/* Potwierdź */}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Przyciski akcji: Offer Draw wyświetlamy tylko, gdy nie jesteśmy na stronie /bot */}
            {!isBot && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-blue-400 border-blue-400/50 hover:bg-blue-400/10">
                    <Handshake className="h-4 w-4 mr-2" />
                    {t("gameControls.offerDraw")} {/* Przycisk zaproponowania remisu */}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className={`${theme === "dark" ? "bg-background/20 opacity-90" : "bg-background"} backdrop-blur-md shadow-lg`}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("gameControls.offerDrawTitle")}</AlertDialogTitle> {/* Tytuł dialogu remisu */}
                    <AlertDialogDescription>{t("gameControls.offerDrawDescription")}</AlertDialogDescription> {/* Opis */}
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("gameControls.cancel")}</AlertDialogCancel> {/* Anuluj */}
                    <AlertDialogAction onClick={sendDrawOffer}>{t("gameControls.sendOffer")}</AlertDialogAction> {/* Wyślij ofertę */}
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
