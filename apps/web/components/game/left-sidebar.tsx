import { Button } from "@workspace/ui/components/button"
import { Users, Trophy, PuzzleIcon as PuzzlePiece, BookOpen, Activity, Settings, PuzzleIcon, Home, Bot, GraduationCap } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext"
import { useTheme } from "next-themes"
import { Separator } from "@workspace/ui/components/separator"
import Link from "next/link"

export function LeftSidebar() {
  const { isLeftSidebarVisible } = useAppContext()
  const { theme } = useTheme()

  if (!isLeftSidebarVisible) {
    return null
  }

  const isDark = theme === "dark"
  const textColor = isDark ? "text-white" : "text-zinc-900"
  const mutedTextColor = isDark ? "text-white/60" : "text-zinc-600"
  const borderColor = isDark ? "border-white/10" : "border-zinc-200"

  return (
    <div className={`w-64 flex flex-col border-r ${borderColor} bg-background/30 backdrop-blur-sm rounded-tr-2xl rounded-br-2xl`}>
      <div className="p-6 text-center">
        <Link href="/">
          <h1 className={`text-2xl font-bold flex items-center justify-start gap-2 ${textColor}`}>
            <PuzzleIcon className="h-6 w-6" />
            Mate Chess
          </h1>
        </Link>
      </div>

      <div className="flex-1 p-4 space-y-6">
        <Link href="/home">
          <div className="space-y-1 ">
            <h3 className={`text-l font flex items-center justify-start gap-2 ${textColor}`}>
              <Home className="ml-3 h-5 w-5" />
              Home
            </h3>
          </div>
        </Link>

        <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />
        <div>
          <h2 className={`text-xs uppercase font-medium ${mutedTextColor} mb-2 px-2`}>PLAY</h2>
          <div className="space-y-1">
            <Button variant="ghost" className={`w-full justify-start ${textColor} hover:bg-white/10`}>
              <Users className="mr-2 h-4 w-4" />
              Play Online
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${textColor} hover:bg-white/10`}>
              <Bot className="mr-2 h-4 w-4" />
              Play vs Bot
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${textColor} hover:bg-white/10`}>
              <Trophy className="mr-2 h-4 w-4" />
              Tournaments
            </Button>
          </div>
        </div>

        <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

        <div>
          <h2 className={`text-xs uppercase font-medium ${mutedTextColor} mb-2 px-2`}>LEARN</h2>
          <div className="space-y-1">
            <Button variant="ghost" className={`w-full justify-start ${textColor} hover:bg-white/10`}>
              <PuzzlePiece className="mr-2 h-4 w-4" />
              Puzzles
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${textColor} hover:bg-white/10`}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Lessons
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${textColor} hover:bg-white/10`}>
              <BookOpen className="mr-2 h-4 w-4" />
              Openings
            </Button>
          </div>
        </div>

        <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

        <div>
          <h2 className={`text-xs uppercase font-medium ${mutedTextColor} mb-2 px-2`}>COMMUNITY</h2>
          <div className="space-y-1">
            <Button variant="ghost" className={`w-full justify-start ${textColor} hover:bg-white/10`}>
              <Users className="mr-2 h-4 w-4" />
              Players
            </Button>
            <Button variant="ghost" className={`w-full justify-start ${textColor} hover:bg-white/10`}>
              <Activity className="mr-2 h-4 w-4" />
              Activity
            </Button>
          </div>
        </div>
      </div>

      <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

      <div className="p-4">
        <Button variant="ghost" className={`w-full justify-start ${textColor} hover:bg-white/10`}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  )
}
