"use client"

import { useEffect } from "react"
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

export default function ChessBoardContainer() {
  const { viewMode, setViewMode } = useGameView()
  const { showPreviewAlert } = useChessBoardInteractions()

  // Przy montowaniu odczytujemy zapisany tryb widoku z localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedViewMode = localStorage.getItem("viewMode")
      if (savedViewMode === "2D" || savedViewMode === "3D") {
        setViewMode(savedViewMode)
      }else{
        setViewMode("2D")
      }
    }
  }, [setViewMode])
  

  // Zapisujemy tryb widoku do localStorage przy każdej jego zmianie
  useEffect(() => {
    if (typeof window !== "undefined") {
      if(viewMode !== undefined){
        localStorage.setItem("viewMode", viewMode)
      }
    }
  }, [viewMode])

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
                <ChessBoard2D />
              </div>
              <GameControls />
            </main>
            <RightPanel />
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
                <ChessBoard3D />
              </div>
              {/* Wrapper dla GameControls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                <GameControls />
              </div>
            </main>
            <RightPanel />
          </SidebarProvider>
        </div>
      )}
    </>
  )
}
