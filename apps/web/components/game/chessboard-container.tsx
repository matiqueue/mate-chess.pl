"use client"

import { useEffect, useState } from "react"
import { useGameView } from "@/contexts/GameViewContext"
import { ChessBoard2D } from "./chessboards/chessboard-2D"
import { ChessBoard3D } from "./chessboards/chessboard-3D"
import { SidebarProvider } from "@workspace/ui/components/sidebar"
import { LeftSidebar } from "./left-sidebar"
import { PlayerInfo } from "./player-info"
import { GameControls } from "./game-controls"
import { RightPanel } from "./right-panel"
import { GameStatusPopupDialog } from "@/components/game/game-status-popup-dialog"
import { PreviewModeAlertPopup } from "@/components/game/preview-mode-alert-popup"
import { useChessBoardInteractions } from "@/utils/chessboard/chessBoardUtils"
import { useTheme } from "next-themes"
import { cos } from "three/src/nodes/TSL.js"

export default function ChessBoardContainer() {
  const { viewMode, setViewMode } = useGameView()
  const { theme, setTheme } = useTheme()
  const { showPreviewAlert } = useChessBoardInteractions()
  const [title, setTitle] = useState("")
  const [desc, setDesc ]= useState("")
  const [isViewModeLoaded, setIsViewModeLoaded] = useState(false);

  const text = {
    onLoad: {
      title: "Ładowanie planszy",
      desc: "Proszę czekać, ładujemy planszę..."
    },
    onViewChange: {
      title2D: "Zmiana perspektywy na 2D",
      desc2D: "Proszę czekać, zmieniamy planszę...",
      title3D: "Zmiana perspektywy na 3D",
      desc3D: "Proszę czekać, zmieniamy planszę..."
    },
    onThemeChange: {
      titleLight: "Ładowanie jasnego motywu",
      descLight: "Proszę czekać, malujemy planszę...",
      titleDark: "Ładowanie ciemnego motywu",
      descDark: "Proszę czekać, malujemy planszę..."
    }
  };
  
  // prosze nie edytować bo wybuchnie od tej linijki do returna

  // Przy montowaniu odczytujemy zapisany tryb widoku z localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedViewMode = localStorage.getItem("viewMode");
      setTitle(text.onLoad.title);
      setDesc(text.onLoad.desc);
  
      if (savedViewMode === "2D" || savedViewMode === "3D") {
        setViewMode(savedViewMode);
      } else {
        setViewMode("2D");
      }
    }
    setIsViewModeLoaded(true); // Ustawiamy, że `viewMode` już się załadowało
  }, [setViewMode]);
  
  // Zapisujemy tryb widoku do localStorage przy każdej jego zmianie
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (viewMode !== undefined) {
        // Zapisujemy viewMode w localStorage
        localStorage.setItem("viewMode", viewMode);
      }
    }
  }, [viewMode, isViewModeLoaded]);
  
  // przeładowujemy stronę, aby zmienił się styl szachów
  useEffect(() => {
    if (isViewModeLoaded) {
      const prev = viewMode;
      setViewMode(viewMode === "2D" ? "3D" : "2D");
      setTimeout(() => {
        setViewMode(prev);
      }, 0);
    }
  }, [theme, isViewModeLoaded]);
  
  // przekazujemy to do buttonów
  const changeTheme = (theme: string) => {
    if (theme === "dark") {
      setTitle(text.onThemeChange.titleDark);
      setDesc(text.onThemeChange.descDark);
    } else {
      setTitle(text.onThemeChange.titleLight);
      setDesc(text.onThemeChange.descLight);
    }
    setTheme(theme);
  };
  
  // przekazujemy to do buttonów
  const changeView = (view: string) => {
    // na odwrót bo jest przekazywany poprzedni stan :)
    if (viewMode === "3D") {
      setTitle(text.onViewChange.title2D);
      setDesc(text.onViewChange.desc2D);
    } else if (viewMode === "2D") {
      setTitle(text.onViewChange.title3D);
      setDesc(text.onViewChange.desc3D);
    }
    setViewMode(view as "2D" | "3D");
  };
  

  return (
    <>
      {/*<PreviewModeAlertPopup open={showPreviewAlert} />*/}
      <GameStatusPopupDialog />
      {viewMode === "2D" ? (
        <div className="relative flex w-full h-full">
          <SidebarProvider>
            <LeftSidebar />
            <main className="flex-1 flex flex-col items-center justify-center p-4">
              <PlayerInfo />
              <div className="flex-1 flex items-center justify-center w-full max-w-[68vh]">
                <ChessBoard2D title={title} desc={desc}/>
              </div>
              <GameControls />
            </main>
            <RightPanel changeTheme={changeTheme} changeView={changeView} />
          </SidebarProvider>
        </div>
      ) : (
        <div className="relative flex w-full h-full">
          <SidebarProvider>
            <LeftSidebar />
            <main className="relative flex-1 ">
              {/* Wrapper dla PlayerInfo */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 w-[103%]">
                <PlayerInfo />
              </div>
              {/* Wrapper dla planszy */}
              <div className="absolute inset-0 pt-[10%]">
                <ChessBoard3D title={title} desc={desc}></ChessBoard3D>
              </div>
              {/* Wrapper dla GameControls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                <GameControls />
              </div>
            </main>
            <RightPanel changeTheme={changeTheme} changeView={changeView} />
          </SidebarProvider>
        </div>
      )}
    </>
  )
}
