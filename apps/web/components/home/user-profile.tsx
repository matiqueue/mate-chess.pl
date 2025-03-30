// Importy bibliotek i komponentów
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs" // Komponenty i hooki do autoryzacji Clerk
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar" // Komponenty awatara użytkownika
import { Button } from "@workspace/ui/components/button" // Komponent przycisku UI
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu" // Komponenty menu rozwijanego
import { User } from "lucide-react" // Ikona użytkownika z biblioteki Lucide
import Link from "next/link" // Komponent Link do nawigacji w Next.js

/**
 * UserProfile
 *
 * Komponent profilu użytkownika wyświetlający opcje logowania dla niezalogowanych
 * użytkowników oraz menu rozwijane z informacjami i opcjami dla zalogowanych.
 *
 * @returns {JSX.Element} Element JSX reprezentujący profil użytkownika.
 *
 * @remarks
 * Komponent integruje autoryzację Clerk, oferując przycisk logowania dla niezalogowanych
 * oraz menu z opcjami profilu, statystyk i wylogowania dla zalogowanych. Używa awatara
 * użytkownika z fallbackiem na inicjały w przypadku braku zdjęcia.
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export const UserProfile = () => {
  // Hooki do zarządzania użytkownikiem i autoryzacją
  const { user } = useUser() // Hook do pobierania danych zalogowanego użytkownika
  const clerk = useClerk() // Hook do zarządzania autoryzacją Clerk

  // Renderowanie komponentu
  return (
    <div>
      <SignedOut>
        <div className="flex items-center gap-4 justify-items-start">
          <Link href="/sign-in">
            <Button variant="outline">Login</Button> {/* Przycisk logowania dla niezalogowanych */}
          </Link>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-4 justify-items-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" /> {/* Ikona użytkownika */}
                <span className="sr-only">Toggle user menu</span> {/* Tekst dostępny tylko dla czytników ekranu */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.fullName}</p> {/* Pełne imię i nazwisko */}
                    <p className="text-xs leading-none text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p> {/* Email użytkownika */}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} /> {/* Zdjęcie użytkownika */}
                    <AvatarFallback>
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]} {/* Inicjały jako fallback */}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator /> {/* Separator w menu */}
              <DropdownMenuItem>
                <Link href="/profile">Profile</Link> {/* Link do profilu */}
              </DropdownMenuItem>
              <DropdownMenuItem>Stats</DropdownMenuItem> {/* Opcja statystyk (bez linku) */}
              <DropdownMenuSeparator /> {/* Separator w menu */}
              <DropdownMenuItem onClick={() => clerk.signOut()}>Log out</DropdownMenuItem> {/* Wylogowanie */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SignedIn>
    </div>
  )
}
