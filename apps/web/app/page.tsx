"use client"


import React  from "react"
import { Loading } from "../components/landing-page/loading-animation"

import dynamic from "next/dynamic";




export default function Page() {
    const Chessboard = dynamic(() => import("@/components/landing-page/Chessboard"), { ssr: false });
   
    return (
        <>
            <Loading />

            <div className="content">
                <h1>Welcome to the Chessboard</h1>
                <p>The battle of wits begins here!</p>
                <Chessboard />
            </div>
        </>
    )
}
