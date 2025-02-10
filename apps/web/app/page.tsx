// app/page.tsx (lub pages/index.tsx, w zależności od struktury projektu)
"use client";

<<<<<<< HEAD
import dynamic from "next/dynamic";
import SkeletonChessboard from "@/components/landing-page/skeletonChessboard";
=======
import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Loading } from "@/components/landing-page/loading-animation"
>>>>>>> e4acb22f827b8015832bc8a7b23dc7001016958f

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
