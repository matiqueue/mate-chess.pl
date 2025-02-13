"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Eye, Layout, Settings2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"

export function FloatingOptions() {
  const [activePopover, setActivePopover] = useState<string | null>(null)

  const togglePopover = (id: string) => {
    setActivePopover(activePopover === id ? null : id)
  }

  return (
    <div className="absolute top-4 right-4 space-y-2">
      <Popover open={activePopover === "view"} onOpenChange={() => togglePopover("view")}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 w-12 h-12 rounded-full">
            <Eye className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <h3 className="font-medium mb-2">View Options</h3>
          <ul className="space-y-1">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                2D
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                3D
              </Button>
            </li>
          </ul>
        </PopoverContent>
      </Popover>

      <Popover open={activePopover === "layout"} onOpenChange={() => togglePopover("layout")}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 w-12 h-12 rounded-full">
            <Layout className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <h3 className="font-medium mb-2">Layout Options</h3>
          <ul className="space-y-1">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Default
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Compact
              </Button>
            </li>
          </ul>
        </PopoverContent>
      </Popover>

      <Popover open={activePopover === "settings"} onOpenChange={() => togglePopover("settings")}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 w-12 h-12 rounded-full">
            <Settings2 className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <h3 className="font-medium mb-2">Game Settings</h3>
          <ul className="space-y-1">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Sound
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Notifications
              </Button>
            </li>
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  )
}

