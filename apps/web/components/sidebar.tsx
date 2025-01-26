import Link from "next/link"
import {
  Home,
  PlayCircle,
  PuzzleIcon as PuzzlePiece,
  Bot,
  GraduationCap,
  Trophy,
  Users,
  BookOpen,
  Activity,
  Settings,
} from "lucide-react"
import { ModeToggle } from "@workspace/ui/components/mode-toggle"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Separator } from "@workspace/ui/components/separator"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@workspace/ui/components/sidebar"

interface NavItemProps {
  href: string
  icon: typeof Home
  children: React.ReactNode
  badge?: string
}

function NavItem({ href, icon: Icon, children, badge }: NavItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-6 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon size={20} />
        <span>{children}</span>
      </div>
      {badge && (
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  )
}

export function Sidebar() {
  return (
    <ShadcnSidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <PuzzlePiece className="h-6 w-6" />
          <h1 className="text-xl font-bold">Mate Chess</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="flex-1">
          <div className="space-y-4">
            <div>
              <NavItem href="/" icon={Home}>
                Home
              </NavItem>
            </div>

            <div>
              <div className="px-6 py-2">
                <h2 className="text-xs font-semibold text-muted-foreground">
                  PLAY
                </h2>
              </div>
              <NavItem href="/play" icon={PlayCircle} badge="Live">
                Play Online
              </NavItem>
              <NavItem href="/bot" icon={Bot}>
                Play vs Bot
              </NavItem>
              <NavItem href="/tournaments" icon={Trophy}>
                Tournaments
              </NavItem>
            </div>

            <div>
              <div className="px-6 py-2">
                <h2 className="text-xs font-semibold text-muted-foreground">
                  LEARN
                </h2>
              </div>
              <NavItem href="/puzzles" icon={PuzzlePiece} badge="Daily">
                Puzzles
              </NavItem>
              <NavItem href="/lessons" icon={GraduationCap}>
                Lessons
              </NavItem>
              <NavItem href="/openings" icon={BookOpen}>
                Openings
              </NavItem>
            </div>

            <div>
              <div className="px-6 py-2">
                <h2 className="text-xs font-semibold text-muted-foreground">
                  COMMUNITY
                </h2>
              </div>
              <NavItem href="/players" icon={Users}>
                Players
              </NavItem>
              <NavItem href="/activity" icon={Activity}>
                Activity
              </NavItem>
            </div>

            <Separator className="mx-6" />

            <div>
              <NavItem href="/settings" icon={Settings}>
                Settings
              </NavItem>
            </div>
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="p-6 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  )
}
