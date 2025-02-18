"use client"

import { ChessBoard } from "@/components/game/chessboard"
import { GameControls } from "@/components/game/game-controls"
import { LeftSidebar } from "@/components/game/left-sidebar"
import { PlayerInfo } from "@/components/game/player-info"
import { RightPanel } from "@/components/game/right-panel"
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
          <main className="flex-1 flex flex-col items-center justify-center p-4">
            <PlayerInfo />
            <div className="flex-1 flex items-center justify-center w-full max-w-[68vh]">
              <ChessBoard />
            </div>
            <GameControls />
          </main>
          <RightPanel />
        </SidebarProvider>
      </div>
    </div>
  )
}

export default function ChessPage() {
  return <ChessPageContent />
}
