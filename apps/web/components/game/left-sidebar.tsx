"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

// Importy bibliotek i komponentów
import { Button } from "@workspace/ui/components/button" // Komponent przycisku UI
import { Users, Trophy, PuzzleIcon as PuzzlePiece, BookOpen, Activity, Settings, Home, Bot, GraduationCap, X } from "lucide-react" // Ikony z biblioteki Lucide
import { useTheme } from "next-themes" // Hook do zarządzania motywem
import { Separator } from "@workspace/ui/components/separator" // Komponent separatora
import Link from "next/link" // Komponent Link do nawigacji w Next.js
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, useSidebar } from "@workspace/ui/components/sidebar" // Komponenty paska bocznego
import { useEffect } from "react" // Hook React do efektów
import { useTranslation } from "react-i18next" // Hook do obsługi tłumaczeń
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu" // Komponenty menu rozwijanego
import { SignedIn, SignedOut, SignInButton, useClerk, useUser } from "@clerk/nextjs" // Komponenty i hooki do autoryzacji Clerk
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar" // Komponenty awatara użytkownika
import { LanguageSwitcher } from "../home/language-switcher" // Komponent przełącznika języków
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog" // Komponenty dialogu ostrzegawczego
import { redirect } from "next/navigation" // Funkcja przekierowania Next.js
import { useSidebarContext } from "@/contexts/SidebarContext" // Kontekst paska bocznego

/**
 * LeftSidebar
 *
 * Komponent lewego paska bocznego w aplikacji szachowej. Zawiera nawigację, informacje o użytkowniku,
 * ustawienia oraz konsolę logów. Pasek może być zwinięty lub rozwinięty, z synchronizacją stanu w localStorage.
 *
 * @returns {JSX.Element} Element JSX reprezentujący lewy pasek boczny.
 *
 * @remarks
 * Komponent integruje autoryzację Clerk, tłumaczenia, motywy oraz kontekst paska bocznego.
 * Obsługuje dwa tryby: domyślny (nawigacja) i konsola (logi). Stylizacja zależy od motywu (jasny/ciemny).
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export function LeftSidebar() {
  const { t } = useTranslation() // Hook do tłumaczeń
  const { theme } = useTheme() // Hook do pobierania motywu
  const { open, setOpen } = useSidebar() // Hook do zarządzania stanem paska bocznego
  const { user } = useUser() // Dane użytkownika z Clerk
  const clerk = useClerk() // Hook do zarządzania autoryzacją Clerk
  const { mode, consoleLogs } = useSidebarContext() // Stan trybu i logi z kontekstu

  // Synchronizacja stanu otwarcia z localStorage przy pierwszym renderowaniu
  useEffect(() => {
    const storedState = localStorage.getItem("sidebarOpen")
    if (storedState !== null) {
      const value = storedState === "true"
      if (open !== value) {
        setOpen(value)
      }
    }
  }, []) // Puste zależności – uruchamia się raz przy montowaniu

  // Zapis stanu otwarcia do localStorage przy każdej zmianie
  useEffect(() => {
    localStorage.setItem("sidebarOpen", open.toString())
  }, [open]) // Uruchamia się przy zmianie stanu open

  // Style zależne od motywu
  const isDark = theme === "dark"
  const textColor = isDark ? "text-white" : "text-zinc-900" // Kolor tekstu
  const mutedTextColor = isDark ? "text-white/60" : "text-zinc-600" // Przytłumiony kolor tekstu
  const borderColor = isDark ? "border-white/10" : "border-zinc-200" // Kolor obramowania

  // Klasy stylów w zależności od stanu otwarcia
  const buttonClass = open
    ? `w-full flex items-center justify-start px-2 ${textColor} hover:bg-white/10`
    : `w-full flex items-center justify-center ${textColor} hover:bg-white/10`
  const iconClass = open ? "mr-2 h-4 w-4" : "h-4 w-4"
  const headerClass = open
    ? `text-2xl font-bold flex items-center pt-4 pl-4 gap-4 ${textColor}`
    : `text-2xl font-bold flex items-center justify-center ${textColor}`
  const titleIconClass = "h-6 w-6 flex-none"

  /**
   * DefaultHeader
   *
   * Komponent nagłówka w trybie domyślnym, wyświetlający logo i nazwę marki.
   *
   * @returns {JSX.Element} Element JSX reprezentujący nagłówek w trybie domyślnym.
   */
  function DefaultHeader() {
    return (
      <SidebarHeader className="p-2 text-center">
        <h1 className={headerClass}>
          <PuzzlePiece className={titleIconClass} /> {/* Ikona puzzla jako logo */}
          {open && t("sidebar.brandName")} {/* Nazwa marki widoczna przy otwartym pasku */}
        </h1>
      </SidebarHeader>
    )
  }

  /**
   * ConsoleHeader
   *
   * Komponent nagłówka w trybie konsoli, wyświetlający tytuł "Konsola".
   *
   * @returns {JSX.Element} Element JSX reprezentujący nagłówek w trybie konsoli.
   */
  function ConsoleHeader() {
    return (
      <SidebarHeader className="p-2 text-center">
        <h1 className={`${headerClass} font-mono`}>{open && "Konsola"}</h1> {/* Tytuł konsoli */}
      </SidebarHeader>
    )
  }

  /**
   * DefaultContent
   *
   * Komponent zawartości w trybie domyślnym, wyświetlający linki nawigacyjne.
   *
   * @returns {JSX.Element} Element JSX reprezentujący zawartość w trybie domyślnym.
   */
  function DefaultContent() {
    return (
      <>
        <Link href="/home">
          <Button variant="ghost" className={buttonClass}>
            <Home className={iconClass} />
            {open && t("sidebar.home")} {/* Link do strony głównej */}
          </Button>
        </Link>
        <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} /> {/* Separator */}
        <div>
          {open && <h2 className={`text-xs uppercase font-medium ${mutedTextColor} mb-2 px-2`}>{t("sidebar.playSection")}</h2>}
          <div className="space-y-1">
            <Link href="/play">
              <Button variant="ghost" className={buttonClass}>
                <Users className={iconClass} />
                {open && t("sidebar.playOnline")} {/* Gra online */}
              </Button>
            </Link>
            <Link href="/bot">
              <Button variant="ghost" className={buttonClass}>
                <Bot className={iconClass} />
                {open && t("sidebar.playVsBot")} {/* Gra z botem */}
              </Button>
            </Link>
            <Link href="/tournaments">
              <Button variant="ghost" className={buttonClass}>
                <Trophy className={iconClass} />
                {open && t("sidebar.tournaments")} {/* Turnieje */}
              </Button>
            </Link>
          </div>
        </div>
        <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} /> {/* Separator */}
        <div>
          {open && <h2 className={`text-xs uppercase font-medium ${mutedTextColor} mb-2 px-2`}>{t("sidebar.learnSection")}</h2>}
          <div className="space-y-1">
            <Button
              onClick={() => {
                redirect("/puzzles")
              }}
              variant="ghost"
              className={buttonClass}
            >
              <PuzzlePiece className={iconClass} />
              {open && t("sidebar.puzzles")} {/* Łamigłówki */}
            </Button>
            <Button
              onClick={() => {
                redirect("/lessons")
              }}
              variant="ghost"
              className={buttonClass}
            >
              <GraduationCap className={iconClass} />
              {open && t("sidebar.lessons")} {/* Lekcje */}
            </Button>
            <Button
              onClick={() => {
                redirect("/openings")
              }}
              variant="ghost"
              className={buttonClass}
            >
              <BookOpen className={iconClass} />
              {open && t("sidebar.openings")} {/* Debiuty */}
            </Button>
          </div>
        </div>
      </>
    )
  }

  /**
   * ConsoleContent
   *
   * Komponent zawartości w trybie konsoli, wyświetlający listę logów.
   *
   * @returns {JSX.Element} Element JSX reprezentujący zawartość w trybie konsoli.
   */
  function ConsoleContent() {
    return (
      <div className="flex-1 px-1 pb-4 font-mono">
        <div className={`${theme === "dark" ? "bg-black/60" : "bg-white/60"} rounded-md p-4 h-[calc(100vh-200px)] overflow-y-auto ${textColor}`}>
          {consoleLogs.length === 0 ? (
            <p className={`text-sm ${mutedTextColor}`}>[Brak logów]</p>
          ) : (
            consoleLogs.map((log, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className={`text-xs ${mutedTextColor}`}></span>
                <p className={`text-sm break-all ${textColor}`}>{log}</p> {/* Wyświetlanie logów */}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  // Renderowanie paska bocznego
  return (
    <Sidebar
      collapsible="icon"
      style={{ width: open ? "16rem" : "4rem" }}
      className={`flex flex-col border-r ${borderColor} bg-background/30 backdrop-blur-sm rounded-tr-2xl rounded-br-2xl`}
    >
      {open && (mode === "default" ? <DefaultHeader /> : <ConsoleHeader />)}
      <SidebarContent className="flex-1 p-4 space-y-4">{mode === "default" ? <DefaultContent /> : <ConsoleContent />}</SidebarContent>
      <Separator className={isDark ? "bg-white/10" : "bg-zinc-200"} /> {/* Separator */}
      <SidebarFooter className="p-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className={buttonClass}>
              <Settings className={iconClass} />
              {open && t("sidebar.settings")} {/* Przycisk ustawień */}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="flex flex-col items-center justify-center bg-sidebar/30 backdrop-blur p-10 rounded-md">
            <Button variant="ghost" className="absolute top-2 right-2" asChild>
              <AlertDialogCancel>
                <X className="h-5 w-5 hover:text-foreground" /> {/* Przycisk zamknięcia dialogu */}
              </AlertDialogCancel>
            </Button>
            <AlertDialogTitle className="text-xl font-semibold text-center mt-2 w-full">{t("settings")}</AlertDialogTitle>
            <div className="flex items-center justify-between w-full mt-2 px-2">
              <SignedOut>
                <SignInButton>
                  <Button variant="outline">{t("login")}</Button> {/* Przycisk logowania */}
                </SignInButton>
                <span className="inline-flex items-center">
                  <LanguageSwitcher /> {/* Przełącznik języków */}
                </span>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} /> {/* Awatar użytkownika */}
                          <AvatarFallback>
                            {user?.firstName?.[0]}
                            {user?.lastName?.[0]} {/* Fallback awatara */}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.fullName}</p> {/* Nazwa użytkownika */}
                          <p className="text-xs leading-none text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p> {/* Email */}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator /> {/* Separator */}
                      <DropdownMenuItem>
                        <Link href="/profile">{t("profile")}</Link> {/* Link do profilu */}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={"profile/stats/" + user?.id}>{t("yourStatistics")}</Link> {/* Link do statystyk */}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator /> {/* Separator */}
                      <DropdownMenuItem onClick={() => clerk.signOut()}>{t("logout")}</DropdownMenuItem> {/* Wylogowanie */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" /> {/* Wskaźnik online */}
                    <span className="text-sm text-muted-foreground">{t("online")}</span>
                  </div>
                </div>
                <span className="inline-flex items-center">
                  <LanguageSwitcher /> {/* Przełącznik języków */}
                </span>
              </SignedIn>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  )
}
