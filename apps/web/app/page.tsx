"use client"

import dynamic from "next/dynamic"
import SkeletonChessboard from "@/components/landing-page/skeletonChessboard"

const Chessboard = dynamic(() => import("@/components/landing-page/chessboard"), {
  ssr: false,
  loading: () => <SkeletonChessboard progress={0} />,
})

export default function Page() {
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
