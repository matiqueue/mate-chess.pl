import { Button } from "@workspace/ui/components/button"
import { Flag, Handshake, RotateCcw, FastForward, ChevronLeft, ChevronRight } from "lucide-react"

export function GameControls() {
  return (
    <div className="w-full py-6 px-8">
      <div className="flex items-center justify-center gap-4 max-w-lg mx-auto">
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
          <ChevronRight className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
          <FastForward className="h-5 w-5" />
        </Button>
        <div className="w-px h-8 bg-white/20 mx-2" />
        <Button variant="outline" size="sm" className="text-red-400 border-red-400/50 hover:bg-red-400/10">
          <Flag className="h-4 w-4 mr-2" />
          Surrender
        </Button>
        <Button variant="outline" size="sm" className="text-blue-400 border-blue-400/50 hover:bg-blue-400/10">
          <Handshake className="h-4 w-4 mr-2" />
          Offer Draw
        </Button>
      </div>
    </div>
  )
}
