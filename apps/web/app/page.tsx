"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Loading } from "@/components/landing-page/loading-animation"

// Dynamiczny import Chessboard
const Chessboard = dynamic(() => import("@/components/landing-page/Chessboard"), { ssr: false })

export default function Page() {
  const [isLoading, setIsLoading] = useState(true) // Czy trwa ładowanie?
  const [isChessboardVisible, setIsChessboardVisible] = useState(false) // Widoczność Chessboard

  useEffect(() => {
    // Symulacja minimalnego czasu ładowania (np. 5 sekund)
    const timer = setTimeout(() => {
      setIsLoading(false) // Wyłącz ekran ładowania po 5 sekundach
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      // Delay dla animacji Chessboard (opcjonalne)
      const fadeTimer = setTimeout(() => {
        setIsChessboardVisible(true)
      }, 200) // Czas oczekiwania na pojawienie się Chessboard
      return () => clearTimeout(fadeTimer)
    }
  }, [isLoading])

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {isLoading && <Loading />}
      <div className={`content ${!isLoading ? "visible" : "hidden"}`}>
        <div className={`chessboard-container ${isChessboardVisible ? "fade-in" : "fade-out"}`}>
          <div style={{ display: isChessboardVisible ? "block" : "none" }}>
            <Chessboard />
          </div>
        </div>
      </div>
    </div>
  )
}
