"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

// Importy bibliotek i komponentów
import { useEffect, useState } from "react" // Hook React do zarządzania stanem
import { Button } from "@workspace/ui/components/button" // Komponent przycisku UI
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
  GripVertical,
  Terminal,
} from "lucide-react" // Ikony z biblioteki Lucide
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover" // Komponenty popoveru
import { Separator } from "@workspace/ui/components/separator" // Komponent separatora
import { Input } from "@workspace/ui/components/input" // Komponent pola tekstowego
import { useTheme } from "next-themes" // Hook do zarządzania motywem
import { ScrollArea } from "@workspace/ui/components/scroll-area" // Komponent przewijanego obszaru
import { usePathname } from "next/navigation" // Hook do pobierania aktualnej ścieżki URL
import { Resizable } from "re-resizable" // Komponent umożliwiający zmianę rozmiaru
import { useSidebar } from "@workspace/ui/components/sidebar" // Hook do zarządzania paskiem bocznym
import { useGameContext } from "@/contexts/GameContext" // Kontekst gry szachowej
import { useGameView } from "@/contexts/GameViewContext" // Kontekst widoku gry
import { FaChessRook as ChessRook, FaChessKnight as ChessKnight, FaChessBishop as ChessBishop, FaChessQueen as ChessQueen } from "react-icons/fa" // Ikony figur szachowych
import { useTranslation } from "react-i18next" // Hook do obsługi tłumaczeń
import { figureType } from "@modules/types" // Typy figur szachowych
import MoveRecordPublic from "@modules/chess/history/move" // Komponent historii ruchów
import { color } from "@modules/types" // Typy kolorów figur
import { useSidebarContext } from "@/contexts/SidebarContext"
import { getNerdData } from "@chess-engine/functions" // Kontekst paska bocznego

/**
 * ToggleSidebarButtonProps
 *
 * Interfejs definiujący właściwości komponentu ToggleSidebarButton.
 *
 * @property {boolean} isNarrow - Określa, czy panel jest w trybie wąskim.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
interface ToggleSidebarButtonProps {
  isNarrow: boolean
}

/**
 * ToggleSidebarButton
 *
 * Komponent przełącznika trybu paska bocznego, umożliwiający zmianę między widokiem domyślnym a konsolą.
 *
 * @param {ToggleSidebarButtonProps} props - Właściwości komponentu, w tym stan wąskości panelu.
 * @returns {JSX.Element} Element JSX reprezentujący przyciski przełączania trybu.
 *
 * @remarks
 * Komponent dostosowuje wygląd przycisków w zależności od szerokości panelu. W trybie konsoli dodaje
 * możliwość testowego logowania.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
function ToggleSidebarButton({ isNarrow }: ToggleSidebarButtonProps) {
  const { mode, setMode, logToSidebar } = useSidebarContext()
  const { getNerdDataString } = useGameContext()
  // Funkcja przełączająca tryb paska bocznego
  const toggleMode = () => {
    setMode(mode === "default" ? "console" : "default")
  }

  // Funkcja testowego logowania
  const testLog = () => {
    logToSidebar(`Log entry at ${new Date().toLocaleTimeString()}`)
  }

  useEffect(() => {
    logToSidebar(getNerdDataString())
  }, [getNerdDataString()])
  const buttonClass = isNarrow
    ? "w-fit p-2 flex items-center justify-center"
    : "flex-1 min-w-[100px] text-sm whitespace-nowrap flex items-center justify-center"

  return (
    <>
      <Button variant="outline" size="sm" className={buttonClass} onClick={toggleMode}>
        <span className="flex-shrink-0">{mode === "default" ? <Terminal className="h-4 w-4" /> : <X className="h-4 w-4" />}</span>
        {!isNarrow && (mode === "default" ? "Switch to Console" : "Default")} {/* Tekst zależny od trybu */}
      </Button>
      {mode === "console" && (
        <Button variant="outline" size="sm" className={buttonClass} onClick={testLog}>
          <span className="flex-shrink-0">
            <Clock className="h-4 w-4" />
          </span>
          {!isNarrow && "Test Log"} {/* Przycisk testowy w trybie konsoli */}
        </Button>
      )}
    </>
  )
}

/**
 * RightPanelProps
 *
 * Interfejs definiujący właściwości komponentu RightPanel.
 *
 * @property {(theme: string) => void} changeTheme - Funkcja zmieniająca motyw aplikacji.
 * @property {(view: string) => void} changeView - Funkcja zmieniająca widok gry (2D/3D).
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
interface RightPanelProps {
  changeTheme: (theme: string) => void
  changeView: (view: string) => void
}

/**
 * RightPanel
 *
 * Komponent prawego panelu w aplikacji szachowej, wyświetlający informacje o grze, historię ruchów,
 * opcje gry, promocję pionka oraz czat. Panel jest responsywny i umożliwia zmianę rozmiaru.
 *
 * @param {RightPanelProps} props - Właściwości komponentu, w tym funkcje zmiany motywu i widoku.
 * @returns {JSX.Element} Element JSX reprezentujący prawy panel.
 *
 * @remarks
 * Komponent integruje wiele kontekstów (gra, widok, motyw, tłumaczenia) i dostosowuje się do trybu
 * gry (lokalny, online, link). Obsługuje zmianę rozmiaru z zapisem w localStorage.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export function RightPanel({ changeTheme, changeView }: RightPanelProps) {
  const { t } = useTranslation() // Hook do tłumaczeń
  const [activePopover, setActivePopover] = useState<string | null>(null) // Stan aktywnych popoverów
  const [notationStyle] = useState("algebraic") // Styl notacji (stały na algebraic)
  const [isChatOpen, setIsChatOpen] = useState(false) // Stan otwarcia czatu

  // Stan szerokości panelu z domyślną wartością z localStorage
  const [currentWidth, setCurrentWidth] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("panelWidth")
      return stored ? Number(stored) : 320
    }
    return 320
  })

  const { theme, setTheme } = useTheme() // Hook do zarządzania motywem
  const { moveHistory, promoteFigure, isAwaitingPromotion, timeLeft } = useGameContext() // Dane gry z kontekstu
  const { setViewMode } = useGameView() // Funkcja zmiany widoku gry
  const isDark = theme === "dark" // Czy motyw jest ciemny
  const textColor = isDark ? "text-white" : "text-zinc-900" // Kolor tekstu
  const mutedTextColor = isDark ? "text-white/60" : "text-zinc-600" // Przytłumiony kolor tekstu
  const borderColor = isDark ? "border-white/10" : "border-zinc-200" // Kolor obramowania
  const bgColor = "bg-background/30" // Kolor tła

  const isNarrow = currentWidth <= 220 // Czy panel jest wąski

  // Formatowanie czasu gry
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeDisplay = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`

  // Obsługa zmiany rozmiaru panelu
  const handleResize = (e: unknown, direction: unknown, ref: HTMLElement) => {
    setCurrentWidth(ref.offsetWidth)
  }

  // Zapis szerokości po zakończeniu zmiany rozmiaru
  const handleResizeStop = (e: unknown, direction: unknown, ref: HTMLElement) => {
    const newWidth = ref.offsetWidth
    setCurrentWidth(newWidth)
    localStorage.setItem("panelWidth", newWidth.toString())
  }

  /**
   * renderMove
   *
   * Funkcja renderująca ruch szachowy w odpowiednim formacie notacji.
   *
   * @param {MoveRecordPublic} moveRecord - Obiekt ruchu szachowego.
   * @returns {string} Sformatowany ciąg znaków reprezentujący ruch.
   */
  const renderMove = (moveRecord: MoveRecordPublic): string => {
    const playerTranslated = moveRecord.playerColor === color.White ? t("playerInfo.white") : t("playerInfo.black")
    let translatedMove = `${playerTranslated}: ${moveRecord.moveString}`
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

  const pathname = usePathname() // Aktualna ścieżka URL
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

  const showChat = !pathname.startsWith("/play/local") // Czy pokazywać czat
  const { open, setOpen } = useSidebar() // Stan paska bocznego

  const bottomButtonClass = isNarrow
    ? "w-fit p-2 flex items-center justify-center"
    : "flex-1 min-w-[100px] text-sm whitespace-nowrap flex items-center justify-center"

  // Renderowanie panelu
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
          <GripVertical className="h-5 w-3" /> {/* Uchwyt do zmiany rozmiaru */}
        </div>
        <div
          className={`w-full p-6 pr-8 flex flex-col justify-between h-full border-l ${borderColor} ${bgColor} backdrop-blur-sm rounded-tl-2xl rounded-bl-2xl`}
        >
          <ScrollArea>
            <div className="space-y-6 flex-grow overflow-auto">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-semibold ${textColor}`}>{t("rightPanel.gameInfo")}</h2> {/* Informacje o grze */}
                  <span className={`text-base pr-1 font-medium ${modeColor}`}>{modeText}</span> {/* Tryb gry */}
                </div>
                <div className="w-[60%]">
                  <div className="flex">
                    <div className={`flex items-center ${textColor}`}>
                      <Clock className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>{timeDisplay}</span> {/* Wyświetlanie czasu */}
                    </div>
                    <div className={`pl-[1rem] flex items-center ${textColor}`}>
                      <Flag className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>{t("rightPanel.blitz")}</span> {/* Tryb blitz */}
                    </div>
                  </div>
                </div>
              </div>
              <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} /> {/* Separator */}
              <div>
                <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>{t("rightPanel.gameOptions")}</h2> {/* Opcje gry */}
                <div className="space-y-2">
                  {pathname.startsWith("/play/local") ? (
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
                              onClick={() => {
                                changeView("2D")
                                setActivePopover(null)
                              }}
                            >
                              2D
                            </Button>
                          </li>
                          <li>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                changeView("3D")
                                setActivePopover(null)
                              }}
                            >
                              3D
                            </Button>
                          </li>
                        </ul>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    ""
                  )}

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
              <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} /> {/* Separator */}
              <div>
                <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>{t("rightPanel.moveHistory")}</h2> {/* Historia ruchów */}
                <div className="text-sm space-y-2 bg-secondary/50 rounded-lg p-3 max-h-[200px] overflow-y-auto">
                  {moveHistory && moveHistory.length > 0 ? (
                    moveHistory.map((movePair: any, index: any) => {
                      const moveNumber = index + 1
                      return (
                        <div key={index} className="flex items-center hover:bg-secondary rounded px-2 py-1 transition-colors whitespace-nowrap">
                          <span>
                            {moveNumber}. Biały: {movePair.white}
                          </span>
                          {movePair.black && <span className="ml-4">Czarny: {movePair.black}</span>}
                        </div>
                      )
                    })
                  ) : (
                    <p className={`${mutedTextColor} text-center`}>{t("rightPanel.noMovesYet")}</p>
                  )}
                </div>
              </div>
              <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} /> {/* Separator */}
              <div className={isAwaitingPromotion() ? "block" : "hidden"}>
                <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>{t("rightPanel.promotePawn")}</h2> {/* Promocja pionka */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className={isNarrow ? "w-fit p-2" : "p-2"} onClick={() => promoteFigure(figureType.rook)}>
                    <ChessRook className="h-6 w-6" />
                    <span className="sr-only">{t("rightPanel.rook")}</span>
                  </Button>
                  <Button variant="outline" className={isNarrow ? "w-fit p-2" : "p-2"} onClick={() => promoteFigure(figureType.queen)}>
                    <ChessQueen className="h-6 w-6" />
                    <span className="sr-only">{t("rightPanel.queen")}</span>
                  </Button>
                  <Button variant="outline" className={isNarrow ? "w-fit p-2" : "p-2"} onClick={() => promoteFigure(figureType.bishop)}>
                    <ChessBishop className="h-6 w-6" />
                    <span className="sr-only">{t("rightPanel.bishop")}</span>
                  </Button>
                  <Button variant="outline" className={isNarrow ? "w-fit p-2" : "p-2"} onClick={() => promoteFigure(figureType.knight)}>
                    <ChessKnight className="h-6 w-6" />
                    <span className="sr-only">{t("rightPanel.knight")}</span>
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
                    <h3 className={`text-lg font-semibold ${textColor}`}>{t("rightPanel.chat")}</h3> {/* Czat */}
                    <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="h-40 overflow-y-auto mb-3">
                    <p className={mutedTextColor}>{t("rightPanel.noMessagesYet")}</p> {/* Brak wiadomości */}
                  </div>
                  <div className="flex">
                    <Input type="text" placeholder={t("rightPanel.typeMessage")} className="flex-grow mr-2" /> {/* Pole wiadomości */}
                    <Button variant="outline">{t("rightPanel.send")}</Button> {/* Przycisk wysyłania */}
                  </div>
                </div>
              ) : (
                <Button variant="outline" size="sm" className={isNarrow ? "w-fit p-2" : "w-full p-2"} onClick={() => setIsChatOpen(true)}>
                  <MessageCircle className="h-4 w-4 flex-shrink-0" />
                  {!isNarrow && <span className="ml-2">{t("rightPanel.openChat")}</span>} {/* Otwórz czat */}
                </Button>
              ))}

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className={bottomButtonClass} onClick={() => setOpen(!open)}>
                <span className="flex-shrink-0">{open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}</span>
                {!isNarrow && (open ? t("rightPanel.hideSidebar") : t("rightPanel.showSidebar"))} {/* Pokaż/ukryj pasek boczny */}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={bottomButtonClass}
                onClick={() => {
                  changeTheme(theme === "dark" ? "light" : "dark")
                }}
              >
                <span className="flex-shrink-0">{isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</span>
                {!isNarrow && (isDark ? t("rightPanel.lightMode") : t("rightPanel.darkMode"))} {/* Przełącz motyw */}
              </Button>
              <ToggleSidebarButton isNarrow={isNarrow} /> {/* Przełącznik trybu paska bocznego */}
            </div>
          </div>
        </div>
      </div>
    </Resizable>
  )
}
