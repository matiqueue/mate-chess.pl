"use client"

import { Search } from "lucide-react"
import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"
import { Input } from "@workspace/ui/components/input"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { usePathname } from "next/navigation"

interface MobileHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MobileHeader({ className }: MobileHeaderProps) {
  const pathname = usePathname()

  const hideNavbar = pathname.startsWith("/play/online/") || pathname.startsWith("/play/link/")
  return (
    <header className={cn("flex flex-col border-b", className)}>
      <div className="flex items-center p-4">
        <SidebarTrigger />
        <Link href="/home">
          <h1 className="ml-4 text-xl font-bold">Mate Chess</h1>
        </Link>
      </div>
      {hideNavbar ? null : (
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search games, players..." className="pl-8" />
          </div>
        </div>
      )}
    </header>
  )
}
