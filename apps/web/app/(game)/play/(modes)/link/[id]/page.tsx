"use client"

import { ChessBoard } from "@/components/game/link/chess-board"
import { GameControls } from "@/components/game/link/game-controls"
import { LeftSidebar } from "@/components/game/link/left-sidebar"

import { PlayerInfo } from "@/components/game/link/player-info"
import { RightPanel } from "@/components/game/link/right-panel"
import { AppProvider, useAppContext } from "@/contexts/AppContext"

function ChessPageContent() {
  const { theme } = useAppContext()

  return (
    <div className="relative flex h-screen overflow-hidden">
      <div
        className={`absolute inset-0 bg-cover bg-center ${
          theme === "dark"
            ? "bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2662&q=80')]"
            : "bg-[url('https://images.unsplash.com/photo-1601297183305-6df142704ea2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2674&q=80')]"
        }`}
      />
      <div className={`absolute inset-0 ${theme === "dark" ? "bg-black/50" : "bg-white/30"} backdrop-blur-sm`} />
      <div className="relative flex w-full h-full text-white dark:text-gray-900">
        <LeftSidebar />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <PlayerInfo />
          <div className="flex-1 flex items-center justify-center w-full max-w-[68vh]">
            <ChessBoard />
          </div>
          <GameControls />
        </main>
        <RightPanel />
      </div>
    </div>
  )
}

export default function LinkChessPage() {
  return (
    <AppProvider>
      <ChessPageContent />
    </AppProvider>
  )
}

