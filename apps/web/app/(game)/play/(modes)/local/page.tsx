"use client"

import ChessBoardContainer from "@/components/game/chessboard-container"
import { GameControls } from "@/components/game/game-controls"
// Zakładam, że masz komponent GameOptions – podobnie jak GameControls

import { LeftSidebar } from "@/components/game/left-sidebar"
import { PlayerInfo } from "@/components/game/player-info"
import { RightPanel } from "@/components/game/right-panel"
import { GameProvider } from "@/contexts/GameContext"
import { GameViewProvider } from "@/contexts/GameViewContext"
import { SidebarProvider } from "@workspace/ui/components/sidebar"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

function ChessPageContent() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative flex h-screen overflow-hidden">
      <div
        className={`absolute inset-0 bg-cover bg-center ${
          theme === "dark"
            ? "bg-[url('/backgrounds/darkThemeBg.png')]"
            : "bg-[url('https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2674&q=80')]"
        }`}
      />
      <div className={`absolute inset-0 ${theme === "dark" ? "bg-black/50" : "bg-white/30"} backdrop-blur-sm`} />
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
              <ChessBoardContainer />
            </div>

            {/* Wrapper dla GameOptions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <GameControls />
            </div>
          </main>
          <RightPanel />
        </SidebarProvider>
      </div>
    </div>
  )
}

export default function ChessPage() {
  return (
    <GameProvider>
      <GameViewProvider>
        <ChessPageContent />
      </GameViewProvider>
    </GameProvider>
  )
}
