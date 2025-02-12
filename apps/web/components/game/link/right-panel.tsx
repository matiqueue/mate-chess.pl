"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Eye,
  Layout,
  Settings2,
  ChevronDown,
  Clock,
  MessageCircle,
  Flag,
  X,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Separator } from "@workspace/ui/components/separator"
import { Input } from "@workspace/ui/components/input"
import { useAppContext } from "@/contexts/AppContext"

export function RightPanel() {
  const [activePopover, setActivePopover] = useState<string | null>(null)
  const [notationStyle, setNotationStyle] = useState("algebraic")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { theme, toggleTheme, isLeftSidebarVisible, toggleLeftSidebar } = useAppContext()

  const togglePopover = (id: string) => {
    setActivePopover(activePopover === id ? null : id)
  }

  const moves = [
    { white: "e4", black: "e5" },
    { white: "Nf3", black: "Nc6" },
    { white: "Bb5", black: "a6" },
    { white: "Ba4", black: "Nf6" },
    { white: "O-O", black: "Be7" },
  ]

  const renderMove = (move: string) => {
    switch (notationStyle) {
      case "algebraic":
        return move
      case "long":
        return move.length > 2 ? move : `P${move}`
      case "descriptive":
        return `P-${move}`
      default:
        return move
    }
  }

  return (
    <div className="w-80 p-6 flex flex-col justify-between h-full border-l border-white/20 dark:border-gray-700 bg-black/30 dark:bg-black/30">
      <div className="space-y-6 flex-grow overflow-auto">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">Game Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-white">
              <Clock className="h-5 w-5 mr-2" />
              <span>10:00</span>
            </div>
            <div className="flex items-center text-white">
              <Flag className="h-5 w-5 mr-2" />
              <span>Blitz</span>
            </div>
          </div>
        </div>

        <Separator className="bg-white/20" />

        <div>
          <h2 className="text-lg font-semibold mb-3 text-white">Game Options</h2>
          <div className="space-y-2">
            <Popover open={activePopover === "view"} onOpenChange={() => togglePopover("view")}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between text-white hover:text-white hover:bg-white/10 border-white/20 bg-transparent"
                >
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" /> View
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 bg-black/80 border-white/20">
                <ul className="space-y-1">
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:text-white hover:bg-white/10"
                    >
                      2D
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:text-white hover:bg-white/10"
                    >
                      3D
                    </Button>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>

            <Popover open={activePopover === "layout"} onOpenChange={() => togglePopover("layout")}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between text-white hover:text-white hover:bg-white/10 border-white/20 bg-transparent"
                >
                  <span className="flex items-center">
                    <Layout className="h-4 w-4 mr-2" /> Layout
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 bg-black/80 border-white/20">
                <ul className="space-y-1">
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:text-white hover:bg-white/10"
                    >
                      Default
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:text-white hover:bg-white/10"
                    >
                      Compact
                    </Button>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>

            <Popover open={activePopover === "settings"} onOpenChange={() => togglePopover("settings")}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between text-white hover:text-white hover:bg-white/10 border-white/20 bg-transparent"
                >
                  <span className="flex items-center">
                    <Settings2 className="h-4 w-4 mr-2" /> Settings
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 bg-black/80 border-white/20">
                <ul className="space-y-1">
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:text-white hover:bg-white/10"
                    >
                      Sound
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:text-white hover:bg-white/10"
                    >
                      Notifications
                    </Button>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Separator className="bg-white/20" />

        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-white">Move History</h2>
            <Select value={notationStyle} onValueChange={setNotationStyle}>
              <SelectTrigger className="w-[130px] bg-black/50 border-white/20 text-white">
                <SelectValue placeholder="Notation" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20 text-white">
                <SelectItem value="algebraic">Algebraic</SelectItem>
                <SelectItem value="long">Long Algebraic</SelectItem>
                <SelectItem value="descriptive">Descriptive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm space-y-1 text-white bg-black/50 rounded-lg p-3 max-h-[200px] overflow-y-auto">
            {moves.map((move, index) => (
              <div key={index} className="flex hover:bg-white/10 rounded px-2 py-1 transition-colors">
                <span className="w-6 text-white/70">{index + 1}.</span>
                <span className="w-14">{renderMove(move.white)}</span>
                <span className="w-14">{renderMove(move.black)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isChatOpen ? (
        <div className="mt-6 bg-black/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-white">Chat</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-40 overflow-y-auto mb-3 text-white">
            <p className="text-white/70">No messages yet.</p>
          </div>
          <div className="flex">
            <Input
              type="text"
              placeholder="Type a message..."
              className="flex-grow mr-2 bg-black/30 border-white/20 text-white"
            />
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 bg-transparent">
              Send
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-white hover:bg-white/10 border-white/20 bg-transparent"
            onClick={() => setIsChatOpen(true)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Open Chat
          </Button>
        </div>
      )}

      <div className="mt-4 flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-white hover:bg-white/10 border-white/20 bg-transparent"
          onClick={toggleLeftSidebar}
        >
          {isLeftSidebarVisible ? (
            <PanelLeftClose className="h-4 w-4 mr-2" />
          ) : (
            <PanelLeftOpen className="h-4 w-4 mr-2" />
          )}
          {isLeftSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-white hover:bg-white/10 border-white/20 bg-transparent"
          onClick={toggleTheme}
        >
          {theme === "light" ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </Button>
      </div>
    </div>
  )
}

