"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Eye, Layout, Settings2, ChevronDown, Clock, MessageCircle, Flag, X, Moon, Sun, PanelLeftClose, PanelLeftOpen, GripVertical } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { Separator } from "@workspace/ui/components/separator"
import { Input } from "@workspace/ui/components/input"

import { useTheme } from "next-themes"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { usePathname } from "next/navigation"
import { FaChessRook as ChessRook, FaChessKnight as ChessKnight, FaChessBishop as ChessBishop, FaChessQueen as ChessQueen } from "react-icons/fa"
import { Resizable } from "re-resizable"
import { useSidebar } from "@workspace/ui/components/sidebar"

export function RightPanel() {
  const [activePopover, setActivePopover] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [currentWidth, setCurrentWidth] = useState(320) // aktualna szerokość panelu

  const { theme, setTheme } = useTheme()

  const isDark = theme === "dark"
  const textColor = isDark ? "text-white" : "text-zinc-900"
  const mutedTextColor = isDark ? "text-white/60" : "text-zinc-600"
  const borderColor = isDark ? "border-white/10" : "border-zinc-200"
  const bgColor = "bg-background/30"

  // Przyjmujemy, że jeśli szerokość panelu ≤ 220px, to jest wąski i wyświetlamy same ikonki.
  const isNarrow = currentWidth <= 220

  // Aktualizacja szerokości w czasie rzeczywistym:
  const handleResize = (e: unknown, direction: unknown, ref: HTMLElement) => {
    setCurrentWidth(ref.offsetWidth)
  }

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

  const { open, setOpen } = useSidebar()

  const bottomButtonClass = isNarrow
    ? "w-fit p-2 flex items-center justify-center"
    : "flex-1 min-w-[100px] text-sm whitespace-nowrap flex items-center justify-center"

  return (
    <Resizable
      defaultSize={{ width: 320, height: "100%" }}
      minWidth={235}
      maxWidth="30%"
      enable={{ left: true }}
      onResize={handleResize}
      onResizeStop={(e, direction, ref) => setCurrentWidth(ref.offsetWidth)}
    >
      <div className="relative w-full h-full">
        {/* Dekoracyjna ikona na lewym borderze – ustawiona trochę wyżej */}
        <div className="absolute left-0 top-[40%] transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none rounded-sm border bg-border">
          <GripVertical className="h-5 w-3" />
        </div>

        {/* Główny kontener panelu */}
        <div
          className={`w-full p-6 pr-8 flex flex-col justify-between h-full border-l ${borderColor} ${bgColor} backdrop-blur-sm rounded-tl-2xl rounded-bl-2xl`}
        >
          <ScrollArea>
            <div className="space-y-6 flex-grow overflow-auto">
              {/* Game Info */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-semibold ${textColor}`}>Game Info</h2>
                  <span className={`text-base pr-1 font-medium ${modeColor}`}>{modeText}</span>
                </div>
                <div className="w-[60%]">
                  <div className="flex">
                    <div className={`flex items-center ${textColor}`}>
                      <Clock className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>10:00</span>
                    </div>
                    <div className={`pl-[1rem] flex items-center ${textColor}`}>
                      <Flag className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>Blitz</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

              {/* Game Options */}
              <div>
                <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>Game Options</h2>
                {isNarrow ? (
                  // Wąski: 2 kolumny (2 rzedy, bo mamy 3 przyciski)
                  <div className="grid grid-cols-2 gap-2">
                    <Popover open={activePopover === "view"} onOpenChange={() => togglePopover("view")}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="w-fit p-2 flex items-center justify-center">
                          <Eye className="h-4 w-4" />
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
                        <Button variant="outline" size="sm" className="w-fit p-2 flex items-center justify-center">
                          <Layout className="h-4 w-4" />
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
                        <Button variant="outline" size="sm" className="w-fit p-2 flex items-center justify-center">
                          <Settings2 className="h-4 w-4" />
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
                ) : (
                  // Szeroki: każdy przycisk w osobnym wierszu
                  <div className="space-y-2">
                    <Popover open={activePopover === "view"} onOpenChange={() => togglePopover("view")}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          <span className="flex items-center">
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
                          <span className="flex items-center">
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
                          <span className="flex items-center">
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
                )}
              </div>

              <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

              <div>
                <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>Move History</h2>
                <div className="text-sm space-y-1 bg-secondary/50 rounded-lg p-3 max-h-[200px] overflow-y-auto">
                  {moves.map((move, index) => (
                    <div key={index} className="flex hover:bg-secondary rounded px-2 py-1 transition-colors">
                      <span className={`w-6 ${mutedTextColor}`}>{index + 1}.</span>
                      <span className={`w-14 ${textColor}`}>{move.white}</span>
                      <span className={`w-14 ${textColor}`}>{move.black}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

              {/* Promote Pawn – przyciski ułożone w 2 kolumny */}
              <div>
                <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>Promote Pawn</h2>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className={isNarrow ? "w-fit p-2 flex items-center justify-center" : "p-2"}>
                    <ChessQueen className="h-6 w-6" />
                    <span className="sr-only">Queen</span>
                  </Button>
                  <Button variant="outline" className={isNarrow ? "w-fit p-2 flex items-center justify-center" : "p-2"}>
                    <ChessRook className="h-6 w-6" />
                    <span className="sr-only">Rook</span>
                  </Button>
                  <Button variant="outline" className={isNarrow ? "w-fit p-2 flex items-center justify-center" : "p-2"}>
                    <ChessBishop className="h-6 w-6" />
                    <span className="sr-only">Bishop</span>
                  </Button>
                  <Button variant="outline" className={isNarrow ? "w-fit p-2 flex items-center justify-center" : "p-2"}>
                    <ChessKnight className="h-6 w-6" />
                    <span className="sr-only">Knight</span>
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Dolny obszar – przyciski */}
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
              <Button
                variant="outline"
                size="sm"
                className={isNarrow ? "w-fit p-2 flex items-center justify-center" : "w-full p-2 flex items-center justify-center"}
                onClick={() => setIsChatOpen(true)}
              >
                <MessageCircle className="h-4 w-4 flex-shrink-0" />
                {!isNarrow && <span className="ml-2">Open Chat</span>}
              </Button>
            )}

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className={bottomButtonClass} onClick={() => setOpen(!open)}>
                <span className="flex-shrink-0">{open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}</span>
                {!isNarrow && (open ? "Hide Sidebar" : "Show Sidebar")}
              </Button>

              <Button variant="outline" size="sm" className={bottomButtonClass} onClick={() => setTheme(isDark ? "light" : "dark")}>
                <span className="flex-shrink-0">{isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</span>
                {!isNarrow && (isDark ? "Light Mode" : "Dark Mode")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Resizable>
  )
}
