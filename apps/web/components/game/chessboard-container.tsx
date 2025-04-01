"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

// Importy bibliotek i komponentów
import { useEffect, useState } from "react" // Hooki React do efektów i stanu
import { useGameView } from "@/contexts/GameViewContext" // Kontekst widoku gry
import { ChessBoard2D } from "./chessboards/chessboard-2D" // Komponent szachownicy 2D
import { ChessBoard3D } from "./chessboards/chessboard-3D" // Komponent szachownicy 3D
import { SidebarProvider } from "@workspace/ui/components/sidebar" // Dostawca kontekstu paska bocznego
import { LeftSidebar } from "./left-sidebar" // Komponent lewego paska bocznego
import { PlayerInfo } from "./player-info" // Komponent informacji o graczach
import { GameControls } from "./game-controls" // Komponent kontrolek gry
import { RightPanel } from "./right-panel" // Komponent prawego panelu
import { GameStatusPopupDialog } from "@/components/game/game-status-popup-dialog" // Dialog statusu gry
import { PreviewModeAlertPopup } from "@/components/game/preview-mode-alert-popup" // Dialog trybu podglądu
import { useChessBoardInteractions } from "@/utils/chessboard/chessBoardUtils" // Hook do interakcji z szachownicą
import { useTheme } from "next-themes" // Hook do zarządzania motywem
import { useTranslation } from "react-i18next" // Hook do obsługi tłumaczeń
import { useSearchParams } from "next/navigation" // Hook do pobierania parametrów URL
import { usePathname } from "next/navigation" // Hook do pobierania ścieżki URL

/**
 * ChessBoardContainer
 *
 * Komponent kontenera szachownicy, który renderuje szachownicę 2D lub 3D w zależności od trybu widoku.
 * Zawiera boczne panele, kontrolki gry i informacje o graczach, z dynamicznym zarządzaniem motywem i widokiem.
 *
 * @returns {JSX.Element} Element JSX reprezentujący kontener szachownicy.
 *
 * @remarks
 * Komponent integruje wiele kontekstów (widok gry, motyw, tłumaczenia) i synchronizuje tryb widoku
 * z localStorage. Obsługuje dwa układy (2D i 3D) z różnym pozycjonowaniem elementów.
 * Autor: matiqueue (Szymon Góral)
 * Tłumaczenie: awres (Filip Serwatka)
 * @source Własna implementacja
 */
export default function ChessBoardContainer() {
  const { viewMode, setViewMode } = useGameView() // Hook do zarządzania trybem widoku
  const { theme, setTheme } = useTheme() // Hook do zarządzania motywem
  const { showPreviewAlert } = useChessBoardInteractions() // Hook do wyświetlania alertu podglądu
  const [title, setTitle] = useState("") // Tytuł wyświetlany na szachownicy
  const [desc, setDesc] = useState("") // Opis wyświetlany na szachownicy
  const [isViewModeLoaded, setIsViewModeLoaded] = useState(false) // Czy tryb widoku został załadowany
  const { t } = useTranslation() // Hook do tłumaczeń
  const pathname = usePathname() // Aktualna ścieżka URL
  const searchParams = useSearchParams() // Parametry wyszukiwania z URL
  const selectedColor = searchParams.get("selectedColor") || "white" // Wybrany kolor gracza (domyślnie biały)

  // Obiekt tekstów dla różnych zdarzeń
  const text = {
    onLoad: {
      title: t("onLoad.title"),
      desc: t("onLoad.desc"),
    },
    onViewChange: {
      title2D: t("onViewChange.title2D"),
      desc2D: t("onViewChange.desc2D"),
      title3D: t("onViewChange.title3D"),
      desc3D: t("onViewChange.desc3D"),
    },
    onThemeChange: {
      titleLight: t("onThemeChange.titleLight"),
      descLight: t("onThemeChange.descLight"),
      titleDark: t("onThemeChange.titleDark"),
      descDark: t("onThemeChange.descDark"),
    },
  }

  // Przy montowaniu odczytujemy zapisany tryb widoku z localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedViewMode = localStorage.getItem("viewMode")
      setTitle(text.onLoad.title)
      setDesc(text.onLoad.desc)

      if (savedViewMode === "2D" || savedViewMode === "3D") {
        setViewMode(savedViewMode)
      } else {
        setViewMode("2D")
      }
    }
    if (!pathname.startsWith("/local")) {
      setViewMode("2D")
    }
    setIsViewModeLoaded(true) // Ustawiamy, że `viewMode` już się załadowało
  }, [setViewMode])

  // Zapisujemy tryb widoku do localStorage przy każdej jego zmianie
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (viewMode !== undefined) {
        localStorage.setItem("viewMode", viewMode)
      }
    }
  }, [viewMode, isViewModeLoaded])

  // Przeładowujemy stronę, aby zmienił się styl szachów
  useEffect(() => {
    if (isViewModeLoaded) {
      const prev = viewMode
      setViewMode(viewMode === "2D" ? "3D" : "2D")
      setTimeout(() => {
        setViewMode(prev)
      }, 0)
    }
  }, [theme, isViewModeLoaded])

  // Przekazujemy to do buttonów
  const changeTheme = (theme: string) => {
    if (theme === "dark") {
      setTitle(text.onThemeChange.titleDark)
      setDesc(text.onThemeChange.descDark)
    } else {
      setTitle(text.onThemeChange.titleLight)
      setDesc(text.onThemeChange.descLight)
    }
    setTheme(theme)
  }

  // Przekazujemy to do buttonów
  const changeView = (view: string) => {
    // Na odwrót, bo jest przekazywany poprzedni stan :)
    if (viewMode === "3D") {
      setTitle(text.onViewChange.title2D)
      setDesc(text.onViewChange.desc2D)
    } else if (viewMode === "2D") {
      setTitle(text.onViewChange.title3D)
      setDesc(text.onViewChange.desc3D)
    }
    setViewMode(view as "2D" | "3D")
  }

  // Renderowanie kontenera szachownicy
  return (
    <>
      {/* <PreviewModeAlertPopup open={showPreviewAlert} /> */} {/* Zakomentowany dialog podglądu */}
      <GameStatusPopupDialog /> {/* Dialog statusu gry */}
      {viewMode === "2D" ? (
        <div className="relative flex w-full h-full">
          <SidebarProvider>
            <LeftSidebar /> {/* Lewy pasek boczny */}
            <main className="flex-1 flex flex-col items-center justify-center p-4">
              <PlayerInfo /> {/* Informacje o graczach */}
              <div className="flex-1 flex items-center justify-center w-full max-w-[68vh]">
                <ChessBoard2D title={title} desc={desc} selectedColor={selectedColor} /> {/* Szachownica 2D */}
              </div>
              <GameControls /> {/* Kontrolki gry */}
            </main>
            <RightPanel changeTheme={changeTheme} changeView={changeView} /> {/* Prawy panel */}
          </SidebarProvider>
        </div>
      ) : (
        <div className="relative flex w-full h-full">
          <SidebarProvider>
            <LeftSidebar /> {/* Lewy pasek boczny */}
            <main className="relative flex-1 ">
              {/* Wrapper dla PlayerInfo */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 w-[103%]">
                <PlayerInfo /> {/* Informacje o graczach */}
              </div>
              {/* Wrapper dla planszy */}
              <div className="absolute inset-0 pt-[10%]">
                <ChessBoard3D title={title} desc={desc} selectedColor={selectedColor}></ChessBoard3D> {/* Szachownica 3D */}
              </div>
              {/* Wrapper dla GameControls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                <GameControls /> {/* Kontrolki gry */}
              </div>
            </main>
            <RightPanel changeTheme={changeTheme} changeView={changeView} /> {/* Prawy panel */}
          </SidebarProvider>
        </div>
      )}
    </>
  )
}
