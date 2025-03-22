"use client"

import dynamic from "next/dynamic" // Import funkcji dynamic do ładowania komponentów po stronie klienta
import SkeletonChessboard from "@/components/landing-page/skeletonChessboard" // Import szkieletu szachownicy jako placeholder

/**
 * Dynamiczny import komponentu Chessboard.
 * Renderowany tylko po stronie klienta (ssr: false) z fallbackiem w postaci SkeletonChessboard.
 *
 * @remarks
 * Autor: awres (Filip Serwartka)
 */
const Chessboard = dynamic(() => import("@/components/landing-page/chessboard"), {
  ssr: false,
  loading: () => <SkeletonChessboard progress={0} />,
})

/**
 * Komponent Page
 *
 * Renderuje pełnoekranowy widok z dynamicznie ładowaną szachownicą.
 *
 * @returns {JSX.Element} Element JSX zawierający szachownicę.
 *
 * @remarks
 * Autor: wojoo (Wojtek Piątek)
 */
export default function Page(): JSX.Element {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Chessboard />
    </div>
  )
}
