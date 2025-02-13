"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Eye, Layout, Settings2, ChevronDown, Clock, MessageCircle, Flag, X, Moon, Sun, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Separator } from "@workspace/ui/components/separator"
import { Input } from "@workspace/ui/components/input"
import { useAppContext } from "@/contexts/AppContext"
import { useTheme } from "next-themes"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { usePathname } from "next/navigation"
import { FaChessRook as ChessRook, FaChessKnight as ChessKnight, FaChessBishop as ChessBishop, FaChessQueen as ChessQueen } from "react-icons/fa"

export function RightPanel() {
  const [activePopover, setActivePopover] = useState<string | null>(null)
  const [notationStyle, setNotationStyle] = useState("algebraic")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { isLeftSidebarVisible, toggleLeftSidebar } = useAppContext()
  const { theme, setTheme } = useTheme()

  const isDark = theme === "dark"
  const textColor = isDark ? "text-white" : "text-zinc-900"
  const mutedTextColor = isDark ? "text-white/60" : "text-zinc-600"
  const borderColor = isDark ? "border-white/10" : "border-zinc-200"

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

  const pathname = usePathname()

  let modeText = ""
  let modeColor = ""

  if (pathname.startsWith("/play/local")) {
    modeText = "Local Mode"
    modeColor = "text-red-500"
  } else if (pathname.startsWith("/play/link")) {
    modeText = "Link Mode"
    modeColor = "text-blue-500"
  } else if (pathname.startsWith("/play/online")) {
    modeText = "Online Mode"
    modeColor = "text-green-500"
  }

  return (
    <div className={`w-80 p-6 flex flex-col justify-between h-full border-l ${borderColor} bg-background/30 backdrop-blur-sm rounded-tl-2xl rounded-bl-2xl`}>
      <ScrollArea>
        <div className="space-y-6 flex-grow overflow-auto">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${textColor}`}>Game Info</h2>
              <span className={`text-base pr-1 font-medium ${modeColor}`}>{modeText}</span>
            </div>
            <div className="w-[60%] ">
              <div className="grid grid-cols-2 gap-4">
                <div className={`flex items-center ${textColor}`}>
                  <Clock className="h-5 w-5 mr-2" />
                  <span>10:00</span>
                </div>
                <div className={`flex items-center ${textColor}`}>
                  <Flag className="h-5 w-5 mr-2" />
                  <span>Blitz</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

          <div>
            <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>Game Options</h2>
            <div className="space-y-2">
              <Popover open={activePopover === "view"} onOpenChange={() => togglePopover("view")}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span className={`flex items-center ${textColor}`}>
                      <Eye className="h-4 w-4 mr-2" /> View
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
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
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span className={`flex items-center ${textColor}`}>
                      <Layout className="h-4 w-4 mr-2" /> Layout
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
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
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span className={`flex items-center ${textColor}`}>
                      <Settings2 className="h-4 w-4 mr-2" /> Settings
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
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
          </div>

          <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className={`text-lg font-semibold ${textColor}`}>Move History</h2>
              <Select value={notationStyle} onValueChange={setNotationStyle}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Notation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="algebraic">Algebraic</SelectItem>
                  <SelectItem value="long">Long Algebraic</SelectItem>
                  <SelectItem value="descriptive">Descriptive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm space-y-1 bg-secondary/50 rounded-lg p-3 max-h-[200px] overflow-y-auto">
              {moves.map((move, index) => (
                <div key={index} className="flex hover:bg-secondary rounded px-2 py-1 transition-colors">
                  <span className={`w-6 ${mutedTextColor}`}>{index + 1}.</span>
                  <span className={`w-14 ${textColor}`}>{renderMove(move.white)}</span>
                  <span className={`w-14 ${textColor}`}>{renderMove(move.black)}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

          <div>
            <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>Promote Pawn</h2>
            <div className="flex justify-between space-x-2">
              <Button variant="outline" className="flex-1 p-2">
                <ChessQueen className="h-6 w-6" />
                <span className="sr-only">Queen</span>
              </Button>
              <Button variant="outline" className="flex-1 p-2">
                <ChessRook className="h-6 w-6" />
                <span className="sr-only">Rook</span>
              </Button>
              <Button variant="outline" className="flex-1 p-2">
                <ChessBishop className="h-6 w-6" />
                <span className="sr-only">Bishop</span>
              </Button>
              <Button variant="outline" className="flex-1 p-2">
                <ChessKnight className="h-6 w-6" />
                <span className="sr-only">Knight</span>
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="mt-6 space-y-2">
        {isChatOpen ? (
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className={`text-lg font-semibold ${textColor}`}>Chat</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-40 overflow-y-auto mb-3">
              <p className={mutedTextColor}>No messages yet.</p>
            </div>
            <div className="flex">
              <Input type="text" placeholder="Type a message..." className="flex-grow mr-2" />
              <Button variant="outline">Send</Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="w-full" onClick={() => setIsChatOpen(true)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Open Chat
          </Button>
        )}

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={toggleLeftSidebar}>
            {isLeftSidebarVisible ? <PanelLeftClose className="h-4 w-4 mr-2" /> : <PanelLeftOpen className="h-4 w-4 mr-2" />}
            {isLeftSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => setTheme(isDark ? "light" : "dark")}>
            {isDark ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
      </div>
    </div>
  )
}
