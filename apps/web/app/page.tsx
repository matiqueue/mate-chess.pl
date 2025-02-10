// app/page.tsx (lub pages/index.tsx, w zależności od struktury projektu)
"use client";

import dynamic from "next/dynamic";
import SkeletonChessboard from "@/components/landing-page/skeletonChessboard";

// Dynamiczny import Chessboard z fallbackiem
const Chessboard = dynamic(
  () => import("@/components/landing-page/chessboard"),
  {
    ssr: false,
    loading: () => <SkeletonChessboard progress={0} />,
  },
);

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
  );
}
