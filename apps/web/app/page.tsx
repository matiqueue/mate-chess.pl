"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Loading } from "@/components/landing-page/loading-animation"

// Dynamiczny import Chessboard
const Chessboard = dynamic(
  () => import("@/components/landing-page/Chessboard"),
  { ssr: false },
)

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
      {isLoading && <Loading />} {/* Ekran ładowania */}
      <div className={`content ${!isLoading ? "visible" : "hidden"}`}>
        <div
          className={`chessboard-container ${
            isChessboardVisible ? "fade-in" : "fade-out"
          }`}
        >
          <div style={{ display: isChessboardVisible ? "block" : "none" }}>
            <Chessboard />
          </div>
        </div>
      </div>
      <style jsx>{`
        .content {
          opacity: 0;
          transition: opacity 1s ease-in-out; /* Płynne przejście całej zawartości */
        }
        .content.visible {
          opacity: 1; /* Widoczne po zakończeniu ładowania */
        }

        .chessboard-container {
          opacity: 0;
          transform: translateY(20px); /* Początkowa pozycja */
          transition:
            opacity 1s ease-in-out,
            transform 1s ease-in-out;
        }
        .chessboard-container.fade-in {
          opacity: 1;
          transform: translateY(0); /* Przesunięcie w miejsce docelowe */
        }
        .chessboard-container.fade-out {
          opacity: 0;
          transform: translateY(20px); /* Wartość na wypadek ukrywania */
        }
      `}</style>
    </div>
  )
}
