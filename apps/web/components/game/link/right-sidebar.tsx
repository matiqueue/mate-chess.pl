import { Button } from "@workspace/ui/components/button"
import { Eye, Layout, Settings2 } from "lucide-react"

export function RightSidebar() {
  return (
    <div className="w-64 bg-black/20 backdrop-blur-sm p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white/50 ml-2">View Options</h3>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
              <Eye className="mr-3 h-4 w-4" />
              Default View
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
              <Layout className="mr-3 h-4 w-4" />
              Top-Down View
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white/50 ml-2">Settings</h3>
          <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
            <Settings2 className="mr-3 h-4 w-4" />
            Figure Icons
          </Button>
        </div>
      </div>
    </div>
  )
}

