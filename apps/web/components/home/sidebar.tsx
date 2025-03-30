"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

// Importy bibliotek i komponentów
import { useUser } from "@clerk/nextjs" // Hook do zarządzania danymi użytkownika z Clerk
import { redirect, usePathname } from "next/navigation" // Funkcje nawigacji Next.js
import Link from "next/link" // Komponent Link do nawigacji w Next.js
import { Home, PlayCircle, PuzzleIcon as PuzzlePiece, Bot, GraduationCap, Trophy, Users, BookOpen, Activity, Settings } from "lucide-react" // Ikony z biblioteki Lucide
import { ScrollArea } from "@workspace/ui/components/scroll-area" // Komponent przewijanego obszaru
import { Separator } from "@workspace/ui/components/separator" // Komponent separatora
import { Sidebar as ShadcnSidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@workspace/ui/components/sidebar" // Komponenty paska bocznego
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu" // Komponenty menu rozwijanego
import { Button } from "@workspace/ui/components/button" // Komponent przycisku UI
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar" // Komponenty awatara użytkownika
import { SignedIn, SignedOut, SignInButton, useClerk } from "@clerk/nextjs" // Komponenty i hooki do autoryzacji Clerk
import { useRouter } from "next/navigation" // Hook do programowej nawigacji w Next.js
import { useTranslation } from "react-i18next" // Hook do obsługi tłumaczeń
import { useEffect, useState } from "react" // Hooki React do efektów i stanu

/**
 * NavItemProps
 *
 * Interfejs definiujący właściwości komponentu NavItem.
 *
 * @property {string} href - Ścieżka URL dla linku nawigacyjnego.
 * @property {typeof Home} icon - Ikona z biblioteki Lucide do wyświetlenia w elemencie.
 * @property {React.ReactNode} children - Zawartość tekstowa elementu nawigacyjnego.
 * @property {string} [badge] - Opcjonalny tekst odznaki (badge) wyświetlany obok elementu.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
interface NavItemProps {
  href: string
  icon: typeof Home
  children: React.ReactNode
  badge?: string
}

/**
 * NavItem
 *
 * Komponent elementu nawigacyjnego w pasku bocznym. Renderuje link z ikoną, tekstem i opcjonalną odznaką.
 *
 * @param {NavItemProps} props - Właściwości komponentu, w tym href, ikona, zawartość i odznaka.
 * @returns {JSX.Element} Element JSX reprezentujący pojedynczy element nawigacyjny.
 *
 * @remarks
 * Komponent używa efektów hover dla lepszej interaktywności. Stylizacja oparta na klasach Tailwind CSS.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
function NavItem({ href, icon: Icon, children, badge }: NavItemProps) {
  return (
    <Link href={href} className="flex items-center justify-between px-6 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-2">
        <Icon size={20} /> {/* Ikona o rozmiarze 20px */}
        <span>{children}</span> {/* Tekst elementu nawigacyjnego */}
      </div>
      {badge && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{badge}</span>} {/* Opcjonalna odznaka */}
    </Link>
  )
}

/**
 * Sidebar
 *
 * Komponent paska bocznego aplikacji szachowej. Zawiera nagłówek z logo, sekcję nawigacyjną
 * z linkami oraz stopkę z informacjami o użytkowniku i opcjami logowania/wylogowania.
 *
 * @returns {JSX.Element | null} Element JSX reprezentujący pasek boczny lub null przed zamontowaniem.
 *
 * @remarks
 * Komponent renderuje się tylko po zamontowaniu po stronie klienta, aby uniknąć problemów
 * z hydratacją. Nie jest wyświetlany na określonych ścieżkach (np. podczas gry online).
 * Integruje funkcje autoryzacji Clerk, tłumaczenia i nawigację Next.js.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export function Sidebar() {
  // Hooki i stan
  const router = useRouter() // Hook do nawigacji programowej
  const pathname = usePathname() // Hook do pobierania aktualnej ścieżki URL
  const { user } = useUser() // Hook do pobierania danych zalogowanego użytkownika
  const clerk = useClerk() // Hook do zarządzania autoryzacją Clerk
  const { t } = useTranslation() // Hook do tłumaczeń
  const [mounted, setMounted] = useState(false) // Stan określający, czy komponent jest zamontowany

  // Efekt ustawiający flagę zamontowania po stronie klienta
  useEffect(() => {
    setMounted(true) // Ustawienie stanu na true po zamontowaniu
  }, []) // Puste zależności - efekt uruchamia się raz po zamontowaniu

  // Zwrócenie null przed zamontowaniem, aby uniknąć błędów hydratacji
  if (!mounted) return null

  // Ukrycie paska bocznego na określonych ścieżkach związanych z grą
  if (pathname.startsWith("/play/online") || pathname.startsWith("/play/link") || pathname === "/play/local") {
    return null
  }

  /**
   * handleClick
   *
   * Obsługuje kliknięcie w nagłówek paska bocznego, czyszcząc ciasteczko i przekierowując na stronę główną.
   *
   * @param {React.MouseEvent} e - Zdarzenie kliknięcia myszą.
   * @returns {Promise<void>}
   */
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await fetch("/api/clearCookie", {
        method: "POST",
      })
    } catch (error) {
      console.error("Błąd przy czyszczeniu ciasteczka:", error)
    }
    router.push("/") // Przekierowanie na stronę główną
  }

  // Renderowanie paska bocznego
  return (
    <ShadcnSidebar>
      <SidebarHeader className="p-6">
        <div onClick={handleClick} style={{ cursor: "pointer" }}>
          <div className="flex items-center gap-2">
            <PuzzlePiece className="h-6 w-6" /> {/* Ikona puzzla jako logo */}
            <h1 className="text-xl font-bold">{t("brandName")}</h1> {/* Nazwa marki z tłumaczeniem */}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="flex-1">
          <div className="space-y-4">
            <div>
              <NavItem href="/home" icon={Home}>
                {t("home")} {/* Link do strony głównej */}
              </NavItem>
            </div>
            <div>
              <div className="px-6 py-2">
                <h2 className="text-xs font-semibold text-muted-foreground">{t("navPlay")}</h2> {/* Sekcja "Graj" */}
              </div>
              <NavItem href="/play" icon={PlayCircle} badge={t("live")}>
                {t("playOnline")} {/* Gra online z odznaką "na żywo" */}
              </NavItem>
              <NavItem href="/bot" icon={Bot}>
                {t("playVsBot")} {/* Gra przeciwko botowi */}
              </NavItem>
              <NavItem href="/tournaments" icon={Trophy}>
                {t("tournaments")} {/* Turnieje */}
              </NavItem>
            </div>
            <div>
              <div className="px-6 py-2">
                <h2 className="text-xs font-semibold text-muted-foreground">{t("navLearn")}</h2> {/* Sekcja "Ucz się" */}
              </div>
              <NavItem href="/puzzles" icon={PuzzlePiece} badge={t("daily")}>
                {t("puzzles")} {/* Łamigłówki z odznaką "codzienne" */}
              </NavItem>
              <NavItem href="/lessons" icon={GraduationCap}>
                {t("lessons")} {/* Lekcje */}
              </NavItem>
              <NavItem href="/openings" icon={BookOpen}>
                {t("openings")} {/* Debiuty */}
              </NavItem>
            </div>
            <Separator className="mx-6" /> {/* Separator między sekcjami */}
            <div>
              <NavItem href="/settings" icon={Settings}>
                {t("settings")} {/* Ustawienia */}
              </NavItem>
            </div>
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <SignedOut>
          <div className="flex items-center gap-4">
            <SignInButton>
              <Button variant="outline">{t("login")}</Button> {/* Przycisk logowania */}
            </SignInButton>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" /> {/* Wskaźnik offline */}
              <span className="text-sm text-muted-foreground">{t("offline")}</span>
            </div>
          </div>
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
                      {user?.lastName?.[0]} {/* Inicjały jako fallback */}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.fullName}</p> {/* Pełne imię i nazwisko */}
                    <p className="text-xs leading-none text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p> {/* Email */}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator /> {/* Separator w menu */}
                <DropdownMenuItem
                  onClick={() => {
                    redirect("profile")
                  }}
                >
                  <Link href="#">{t("profile")}</Link> {/* Link do profilu */}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    redirect("profile/stats/" + user?.id)
                  }}
                >
                  <Link href="#">{t("yourStatistics")}</Link> {/* Link do statystyk */}
                </DropdownMenuItem>
                <DropdownMenuSeparator /> {/* Separator w menu */}
                <DropdownMenuItem onClick={() => clerk.signOut()}>{t("logout")}</DropdownMenuItem> {/* Wylogowanie */}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" /> {/* Wskaźnik online */}
              <span className="text-sm text-muted-foreground">{t("online")}</span>
            </div>
          </div>
        </SignedIn>
      </SidebarFooter>
    </ShadcnSidebar>
  )
}
