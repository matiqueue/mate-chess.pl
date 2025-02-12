import { Button } from "@workspace/ui/components/button"
import { Users, Monitor, Trophy, PuzzleIcon as PuzzlePiece, BookOpen, Folder, Activity, Settings } from "lucide-react"
import { useAppContext } from "@/contexts/AppContext"

export function LeftSidebar() {
  const { isLeftSidebarVisible } = useAppContext()

  if (!isLeftSidebarVisible) {
    return null
  }

  return (
    <div className="w-64 p-4 flex flex-col border-r border-white/20 dark:border-gray-700 bg-black/30 dark:bg-black/30">
      <div className="mb-8">
        <h1 className="text-xl font-bold flex items-center gap-2 text-white">
          <Monitor className="h-6 w-6" />
          Mate-Chess
        </h1>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xs uppercase text-white/70 mb-2">PLAY</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-white/10">
              <Users className="mr-2 h-4 w-4" />
              Play Online
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-white/10">
              <Monitor className="mr-2 h-4 w-4" />
              Play vs Bot
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-white/10">
              <Trophy className="mr-2 h-4 w-4" />
              Tournaments
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xs uppercase text-white/70 mb-2">LEARN</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-white/10">
              <PuzzlePiece className="mr-2 h-4 w-4" />
              Puzzles
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-white/10">
              <BookOpen className="mr-2 h-4 w-4" />
              Lessons
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-white/10">
              <Folder className="mr-2 h-4 w-4" />
              Openings
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xs uppercase text-white/70 mb-2">COMMUNITY</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-white/10">
              <Users className="mr-2 h-4 w-4" />
              Players
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-white/10">
              <Activity className="mr-2 h-4 w-4" />
              Activity
            </Button>
          </div>
        </div>

        <Button variant="ghost" className="w-full justify-start mt-auto text-white hover:text-white hover:bg-white/10">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  )
}

