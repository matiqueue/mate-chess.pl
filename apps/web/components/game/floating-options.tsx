"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

// Importy bibliotek i komponentów
import { useState } from "react" // Hook React do zarządzania stanem
import { Button } from "@workspace/ui/components/button" // Komponent przycisku UI
import { Eye, Layout, Settings2 } from "lucide-react" // Ikony z biblioteki Lucide
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover" // Komponenty popoveru

/**
 * FloatingOptions
 *
 * Komponent pływających opcji gry, wyświetlający przyciski z menu kontekstowymi (popoverami)
 * do zmiany widoku, układu i ustawień gry. Znajduje się w prawym górnym rogu ekranu.
 *
 * @returns {JSX.Element} Element JSX reprezentujący pływające opcje.
 *
 * @remarks
 * Komponent używa stanu do zarządzania aktywnym popoverem, umożliwiając otwieranie i zamykanie
 * menu kontekstowych. Stylizacja jest stała (szary odcień), niezależna od motywu aplikacji.
 * Autor: matiqueue (Szymon Góral)
 * Tłumaczenie: awres (Filip Serwatka)
 * @source Własna implementacja
 */
export function FloatingOptions() {
  const [activePopover, setActivePopover] = useState<string | null>(null) // Stan określający aktywny popover

  /**
   * togglePopover
   *
   * Funkcja przełączająca widoczność popoveru na podstawie jego identyfikatora.
   *
   * @param {string} id - Identyfikator popoveru (view, layout, settings).
   */
  const togglePopover = (id: string) => {
    setActivePopover(activePopover === id ? null : id) // Przełącza popover na otwarty/zamknięty
  }

  // Renderowanie pływających opcji
  return (
    <div className="absolute top-4 right-4 space-y-2">
      <Popover open={activePopover === "view"} onOpenChange={() => togglePopover("view")}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 w-12 h-12 rounded-full">
            <Eye className="h-6 w-6" /> {/* Ikona oka dla opcji widoku */}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <h3 className="font-medium mb-2">View Options</h3> {/* Tytuł: Opcje widoku */}
          <ul className="space-y-1">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                2D {/* Opcja widoku 2D */}
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                3D {/* Opcja widoku 3D */}
              </Button>
            </li>
          </ul>
        </PopoverContent>
      </Popover>

      <Popover open={activePopover === "layout"} onOpenChange={() => togglePopover("layout")}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 w-12 h-12 rounded-full">
            <Layout className="h-6 w-6" /> {/* Ikona układu dla opcji layoutu */}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <h3 className="font-medium mb-2">Layout Options</h3> {/* Tytuł: Opcje układu */}
          <ul className="space-y-1">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Default {/* Domyślny układ */}
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Compact {/* Kompaktowy układ */}
              </Button>
            </li>
          </ul>
        </PopoverContent>
      </Popover>

      <Popover open={activePopover === "settings"} onOpenChange={() => togglePopover("settings")}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 w-12 h-12 rounded-full">
            <Settings2 className="h-6 w-6" /> {/* Ikona ustawień dla opcji gry */}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <h3 className="font-medium mb-2">Game Settings</h3> {/* Tytuł: Ustawienia gry */}
          <ul className="space-y-1">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Sound {/* Opcja dźwięku */}
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Notifications {/* Opcja powiadomień */}
              </Button>
            </li>
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  )
}
