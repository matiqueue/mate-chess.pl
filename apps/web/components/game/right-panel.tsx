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
import { Resizable } from "re-resizable"
import { useSidebar } from "@workspace/ui/components/sidebar"
import { useGameContext } from "@/contexts/GameContext"
import { useGameView } from "@/contexts/GameViewContext"
import { FaChessRook as ChessRook, FaChessKnight as ChessKnight, FaChessBishop as ChessBishop, FaChessQueen as ChessQueen } from "react-icons/fa"
import { useTranslation } from "react-i18next"
import { figureType } from "@modules/types"

export function RightPanel() {
  const { t } = useTranslation()
  const [activePopover, setActivePopover] = useState<string | null>(null)
  const [notationStyle] = useState("algebraic")
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Lazy initial state – odczytujemy panelWidth z localStorage lub ustawiamy 320 domyślnie
  const [currentWidth, setCurrentWidth] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("panelWidth")
      return stored ? Number(stored) : 320
    }
    return 320
  })

  const { theme, setTheme } = useTheme()
  const { moveHistory, promote, isAwaitingPromotion } = useGameContext()
  const { setViewMode } = useGameView()

  const isDark = theme === "dark"
  const textColor = isDark ? "text-white" : "text-zinc-900"
  const mutedTextColor = isDark ? "text-white/60" : "text-zinc-600"
  const borderColor = isDark ? "border-white/10" : "border-zinc-200"
  const bgColor = "bg-background/30"

  const isNarrow = currentWidth <= 220

  // Aktualizujemy stan podczas zmiany rozmiaru
  const handleResize = (e: unknown, direction: unknown, ref: HTMLElement) => {
    setCurrentWidth(ref.offsetWidth)
  }

  // Po zakończeniu zmiany rozmiaru zapisujemy nową szerokość do localStorage
  const handleResizeStop = (e: unknown, direction: unknown, ref: HTMLElement) => {
    const newWidth = ref.offsetWidth
    setCurrentWidth(newWidth)
    localStorage.setItem("panelWidth", newWidth.toString())
  }

  const renderMove = (move: string) => {
    let translatedMove = move

    // Najpierw zamieniamy "White:" na tłumaczenie, np. "Biały:"
    if (move.includes("White:")) {
      translatedMove = move.replace("White:", t("playerInfo.white") + ":")
    }
    if (move.includes("Black:")) {
      translatedMove = move.replace("Black:", t("playerInfo.black") + ":")
    }

    // Teraz (opcjonalnie) reszta logiki dla stylów notacji
    switch (notationStyle) {
      case "algebraic":
        return translatedMove
      case "long":
        return translatedMove.length > 2 ? translatedMove : `P${translatedMove}`
      case "descriptive":
        return `P-${translatedMove}`
      default:
        return translatedMove
    }
  }

  const pathname = usePathname()
  let modeText = ""
  let modeColor = ""
  if (pathname.startsWith("/play/local")) {
    modeText = t("rightPanel.localMode")
    modeColor = "text-red-500"
  } else if (pathname.startsWith("/play/link")) {
    modeText = t("rightPanel.linkMode")
    modeColor = "text-blue-500"
  } else if (pathname.startsWith("/play/online")) {
    modeText = t("rightPanel.onlineMode")
    modeColor = "text-green-500"
  }

  // Ustalamy, czy wyświetlać chat – nie pokazujemy go, gdy ścieżka to /play/local
  const showChat = !pathname.startsWith("/play/local")

  const { open, setOpen } = useSidebar()

  const bottomButtonClass = isNarrow
    ? "w-fit p-2 flex items-center justify-center"
    : "flex-1 min-w-[100px] text-sm whitespace-nowrap flex items-center justify-center"

  return (
    <Resizable
      defaultSize={{ width: currentWidth, height: "100%" }}
      minWidth={235}
      maxWidth="30%"
      enable={{ left: true }}
      onResize={handleResize}
      onResizeStop={handleResizeStop}
    >
      <div className="relative w-full h-full">
        <div className="absolute left-0 top-[40%] transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none rounded-sm border bg-border">
          <GripVertical className="h-5 w-3" />
        </div>
        <div
          className={`w-full p-6 pr-8 flex flex-col justify-between h-full border-l ${borderColor} ${bgColor} backdrop-blur-sm rounded-tl-2xl rounded-bl-2xl`}
        >
          <ScrollArea>
            <div className="space-y-6 flex-grow overflow-auto">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-semibold ${textColor}`}>{t("rightPanel.gameInfo")}</h2>
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
                      <span>{t("rightPanel.blitz")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

              <div>
                <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>{t("rightPanel.gameOptions")}</h2>
                <div className="space-y-2">
                  <Popover open={activePopover === "view"} onOpenChange={(open) => setActivePopover(open ? "view" : null)}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-between">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" /> {t("rightPanel.view")}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className={`w-fit p-2 rounded shadow ${isDark ? "bg-stone-950/90" : "bg-white/80"}`}>
                      <ul className="flex space-x-1">
                        <li>
                          <Button
                            variant="ghost"
                            className="justify-center"
                            onClick={() => {
                              setViewMode("2D")
                              setActivePopover(null)
                            }}
                          >
                            2D
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="ghost"
                            className="justify-center"
                            onClick={() => {
                              setViewMode("3D")
                              setActivePopover(null)
                            }}
                          >
                            3D
                          </Button>
                        </li>
                      </ul>
                    </PopoverContent>
                  </Popover>

                  <Popover open={activePopover === "layout"} onOpenChange={(open) => setActivePopover(open ? "layout" : null)}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-between">
                        <span className="flex items-center">
                          <Layout className="h-4 w-4 mr-2" /> {t("rightPanel.layout")}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className={`w-fit p-2 rounded shadow ${isDark ? "bg-stone-950/90" : "bg-white/80"}`}>
                      <ul className="space-y-1">
                        <li>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              console.log("Default layout")
                              setActivePopover(null)
                            }}
                          >
                            {t("rightPanel.defaultLayout")}
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              console.log("Compact layout")
                              setActivePopover(null)
                            }}
                          >
                            {t("rightPanel.compactLayout")}
                          </Button>
                        </li>
                      </ul>
                    </PopoverContent>
                  </Popover>

                  <Popover open={activePopover === "settings"} onOpenChange={(open) => setActivePopover(open ? "settings" : null)}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-between">
                        <span className="flex items-center">
                          <Settings2 className="h-4 w-4 mr-2" /> {t("rightPanel.settings")}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className={`w-fit p-2 rounded shadow ${isDark ? "bg-stone-950/90" : "bg-white/80"}`}>
                      <ul className="space-y-1">
                        <li>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              console.log("Sound")
                              setActivePopover(null)
                            }}
                          >
                            {t("rightPanel.sound")}
                          </Button>
                        </li>
                        <li>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              console.log("Notifications")
                              setActivePopover(null)
                            }}
                          >
                            {t("rightPanel.notifications")}
                          </Button>
                        </li>
                      </ul>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

              <div>
                <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>{t("rightPanel.moveHistory")}</h2>
                <div className="text-sm space-y-2 bg-secondary/50 rounded-lg p-3 max-h-[200px] overflow-y-auto">
                  {moveHistory && moveHistory.length > 0 ? (
                    moveHistory.map((moveStr, index) => (
                      <div key={index} className="hover:bg-secondary rounded px-2 py-1 transition-colors whitespace-nowrap">
                        <span className={`w-6 ${mutedTextColor}`}>{index + 1}.</span>
                        <span className={`w-full ${textColor}`}>{renderMove(moveStr)}</span>
                      </div>
                    ))
                  ) : (
                    <p className={`${mutedTextColor} text-center`}>{t("rightPanel.noMovesYet")}</p>
                  )}
                </div>
              </div>

              <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} />

              <div className={isAwaitingPromotion() ? "block" : "hidden"}>
                <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>{t("rightPanel.promotePawn")}</h2>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className={isNarrow ? "w-fit p-2 flex items-center justify-center" : "p-2"}>
                    <ChessRook className="h-6 w-6" />
                    <span className="sr-only" onClick={() => promote(figureType.rook)}>
                      {t("rightPanel.rook")}
                    </span>
                  </Button>
                  <Button variant="outline" className={isNarrow ? "w-fit p-2 flex items-center justify-center" : "p-2"}>
                    <ChessQueen className="h-6 w-6" />
                    <span className="sr-only" onClick={() => promote(figureType.queen)}>
                      {t("rightPanel.queen")}
                    </span>
                  </Button>
                  <Button variant="outline" className={isNarrow ? "w-fit p-2 flex items-center justify-center" : "p-2"}>
                    <ChessBishop className="h-6 w-6" />
                    <span className="sr-only" onClick={() => promote(figureType.bishop)}>
                      {t("rightPanel.bishop")}
                    </span>
                  </Button>
                  <Button variant="outline" className={isNarrow ? "w-fit p-2 flex items-center justify-center" : "p-2"}>
                    <ChessKnight className="h-6 w-6" />
                    <span className="sr-only" onClick={() => promote(figureType.knight)}>
                      {t("rightPanel.knight")}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
          <div className="mt-6 space-y-2">
            {showChat &&
              (isChatOpen ? (
                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`text-lg font-semibold ${textColor}`}>{t("rightPanel.chat")}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="h-40 overflow-y-auto mb-3">
                    <p className={mutedTextColor}>{t("rightPanel.noMessagesYet")}</p>
                  </div>
                  <div className="flex">
                    <Input type="text" placeholder={t("rightPanel.typeMessage")} className="flex-grow mr-2" />
                    <Button variant="outline">{t("rightPanel.send")}</Button>
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
                  {!isNarrow && <span className="ml-2">{t("rightPanel.openChat")}</span>}
                </Button>
              ))}

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className={bottomButtonClass} onClick={() => setOpen(!open)}>
                <span className="flex-shrink-0">{open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}</span>
                {!isNarrow && (open ? t("rightPanel.hideSidebar") : t("rightPanel.showSidebar"))}
              </Button>

              <Button variant="outline" size="sm" className={bottomButtonClass} onClick={() => setTheme(isDark ? "light" : "dark")}>
                <span className="flex-shrink-0">{isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</span>
                {!isNarrow && (isDark ? t("rightPanel.lightMode") : t("rightPanel.darkMode"))}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Resizable>
  )
}
