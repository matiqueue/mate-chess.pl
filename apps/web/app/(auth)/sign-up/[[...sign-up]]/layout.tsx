import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up | Mate-Chess",
  description: "Create your first!",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-screen" style={{ height: "calc(100vh - 128px)" }}>
      {/* Left side - children component */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 relative">
        <div className="z-10 w-full max-w-md">
          {children}
        </div>
      </div>
      
      {/* Right side - full-width image */}
      <div className="hidden md:block w-1/2 h-full relative" style={{ height: "calc(100vh - 128px)" }}>
        <Image
          src="/backgrounds/sign-in-background.webp"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}