// Importy bibliotek i komponentów
import { useEffect, useState } from "react" // Hooki React do efektów i stanu
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@workspace/ui/components/alert-dialog" // Komponenty dialogu ostrzegawczego
import { useTheme } from "next-themes" // Hook do zarządzania motywem
import { useGameContext } from "@/contexts/GameContext" // Kontekst gry szachowej

/**
 * PreviewModeAlertPopupProps
 *
 * Interfejs definiujący właściwości komponentu PreviewModeAlertPopup.
 *
 * @property {boolean} isOpen - Określa, czy dialog powinien być otwarty.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
interface PreviewModeAlertPopupProps {
  isOpen: boolean
}

/**
 * PreviewModeAlertPopup
 *
 * Komponent dialogu ostrzegawczego informującego o trybie podglądu planszy szachowej.
 * Wyświetla się, gdy użytkownik próbuje wykonać ruch w trybie podglądu.
 *
 * @param {PreviewModeAlertPopupProps} props - Właściwości komponentu, w tym stan otwarcia dialogu.
 * @returns {JSX.Element} Element JSX reprezentujący dialog ostrzegawczy.
 *
 * @remarks
 * Komponent dostosowuje styl do aktualnego motywu (jasny/ciemny) i automatycznie otwiera się,
 * gdy parametr `isOpen` zmienia się na `true`. Używa efektu rozmycia tła dla lepszej estetyki.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export const PreviewModeAlertPopup = ({ isOpen }: PreviewModeAlertPopupProps) => {
  const { theme } = useTheme() // Hook do pobierania aktualnego motywu
  const [open, setOpen] = useState(false) // Stan otwarcia dialogu

  // Efekt synchronizujący stan otwarcia dialogu z parametrem isOpen
  useEffect(() => {
    setOpen(isOpen) // Ustawienie stanu otwarcia na podstawie props
  }, [isOpen]) // Uruchamiane przy zmianie isOpen

  // Renderowanie dialogu
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className={`${theme === "dark" ? "bg-background/20 opacity-90" : "bg-background"} backdrop-blur-md shadow-lg`}>
        <AlertDialogHeader>
          <AlertDialogTitle>Tryb podglądu</AlertDialogTitle> {/* Tytuł dialogu */}
          <AlertDialogDescription>
            Plansza znajduje się w trybie podglądu. Aby wykonać ten ruch, plansza zostanie przywrócona do trybu gry
          </AlertDialogDescription>{" "}
          {/* Opis informujący o trybie podglądu */}
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
