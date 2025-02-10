"use client";

import { Statistics } from "@/components/statistics/statistics-page"
import { Navbar } from "@/components/other/main-navbar"
import { Footer } from "@/components/other/main-footer"
export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const id = (await params).id
    return (
          <div className="flex flex-col h-screen">
            <div className="flex-shrink-0">
              <Navbar />
            </div>
      
            <div className="flex-grow flex items-center justify-center">
              <Statistics id={id}></Statistics>
            </div>
      
            <div className="flex-shrink-0">
              <Footer />
            </div>
          </div>
    )
  }