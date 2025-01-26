import { Search } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Input } from "@workspace/ui/components/input"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"

interface MobileHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MobileHeader({ className }: MobileHeaderProps) {
  return (
    <header className={cn("flex flex-col border-b", className)}>
      <div className="flex items-center p-4">
        <SidebarTrigger />
        <h1 className="ml-4 text-xl font-bold">Chess Master</h1>
      </div>
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search games, players..." className="pl-8" />
        </div>
      </div>
    </header>
  )
}
