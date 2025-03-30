"use client" // Dyrektywa określająca, że komponent działa po stronie klienta

// Importy bibliotek i komponentów
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar" // Komponenty awatara użytkownika
import { useTheme } from "next-themes" // Hook do zarządzania motywem
import { useGameContext } from "@/contexts/GameContext" // Kontekst gry szachowej
import { useUser } from "@clerk/nextjs" // Hook do zarządzania danymi użytkownika z Clerk
import { useTranslation } from "react-i18next" // Hook do obsługi tłumaczeń
import { gameStatusType } from "@shared/types/gameStatusType" // Typy statusu gry
import { useSearchParams } from "next/navigation" // Hook do pobierania parametrów wyszukiwania z URL

/**
 * PlayerInfo
 *
 * Komponent wyświetlający informacje o graczach w grze szachowej, w tym awatary, nazwy,
 * czasy gry oraz aktualny status gry. Dostosowuje dane w zależności od trybu gry (lokalny, online, bot).
 *
 * @returns {JSX.Element} Element JSX reprezentujący informacje o graczach.
 *
 * @remarks
 * Komponent używa kontekstu gry i danych użytkownika z Clerk, aby dynamicznie wyświetlać informacje.
 * Obsługuje różne tryby gry (lokalny, online, link, bot) i dostosowuje style do motywu (jasny/ciemny).
 * Autor: matiqueue (Szymon Góral)
 * @source Własna implementacja
 */
export function PlayerInfo() {
  const { t } = useTranslation() // Hook do tłumaczeń
  const { theme } = useTheme() // Hook do pobierania aktualnego motywu
  const searchParams = useSearchParams() // Hook do pobierania parametrów z URL
  const selectedColor = searchParams.get("selectedColor") || "white" // Wybrany kolor gracza (domyślnie biały)

  const { currentPlayer, gameStatus, whiteTime, blackTime } = useGameContext() // Dane gry z kontekstu
  const { user, isSignedIn } = useUser() // Dane użytkownika z Clerk
  const pathname = typeof window !== "undefined" ? window.location.pathname : "" // Aktualna ścieżka URL

  // Style zależne od motywu
  const textColor = theme === "dark" ? "text-white" : "text-zinc-900" // Kolor tekstu
  const mutedTextColor = theme === "dark" ? "text-white/60" : "text-zinc-600" // Przytłumiony kolor tekstu
  const timerBg = theme === "dark" ? "bg-zinc-800" : "bg-white/50" // Tło timera

  // Formatowanie czasu dla białych
  const whiteMinutes = Math.floor(whiteTime / 60)
  const whiteSeconds = whiteTime % 60
  const whiteTimeDisplay = `${whiteMinutes}:${whiteSeconds < 10 ? "0" : ""}${whiteSeconds}`

  // Formatowanie czasu dla czarnych
  const blackMinutes = Math.floor(blackTime / 60)
  const blackSeconds = blackTime % 60
  const blackTimeDisplay = `${blackMinutes}:${blackSeconds < 10 ? "0" : ""}${blackSeconds}`

  // Domyślne dane użytkownika z Clerk
  const clerkImage = isSignedIn && user?.imageUrl ? user.imageUrl : "https://banner2.cleanpng.com/20180603/jx/avomq8xby.webp" // Obraz użytkownika
  const clerkFallback = isSignedIn && user?.firstName ? user.firstName.slice(0, 2).toUpperCase() : "GU" // Fallback awatara
  const clerkName = isSignedIn && user?.firstName ? user.firstName : t("playerInfo.guest") // Nazwa użytkownika

  // Logika profilu graczy w zależności od ścieżki
  let firstUserImage = clerkImage
  let firstUserFallback = clerkFallback
  let firstUserName = clerkName
  let secondUserImage = "https://banner2.cleanpng.com/20180603/jx/avomq8xby.webp"
  let secondUserFallback = "GU"
  let secondUserName = t("playerInfo.guest")

  if (pathname.startsWith("/play/link/") || pathname.startsWith("/play/online")) {
    // Gry online/link: dane pierwszego gracza z Clerk, drugiego mogą być aktualizowane gdzie indziej
    firstUserImage = clerkImage
    firstUserFallback = clerkFallback
    firstUserName = clerkName
    secondUserImage = clerkImage // Może być zaktualizowane dla rzeczywistego przeciwnika
    secondUserFallback = clerkFallback
    secondUserName = clerkName
  } else if (pathname === "/play/local") {
    // Gra lokalna: obaj gracze to ten sam użytkownik Clerk
    firstUserImage = clerkImage
    firstUserFallback = clerkFallback
    firstUserName = clerkName
    secondUserImage = clerkImage
    secondUserFallback = clerkFallback
    secondUserName = clerkName
  } else if (pathname.startsWith("/bot/")) {
    // Gra z botem: pierwszy gracz z Clerk, drugi to "Mate Bot" lub odwrotnie w zależności od wybranego koloru
    if (selectedColor === "white") {
      firstUserImage = clerkImage
      firstUserFallback = clerkFallback
      firstUserName = clerkName
      secondUserImage = "https://banner2.cleanpng.com/20180603/jx/avomq8xby.webp" // Możliwe użycie specyficznego obrazu bota
      secondUserFallback = "MB"
      secondUserName = "Mate Bot" // Stała nazwa dla bota
    } else {
      firstUserImage = "https://banner2.cleanpng.com/20180603/jx/avomq8xby.webp"
      firstUserFallback = "MB"
      firstUserName = "Mate Bot" // Stała nazwa dla bota
      secondUserImage = clerkImage
      secondUserFallback = clerkFallback
      secondUserName = clerkName
    }
  }

  // Aktualna tura z tłumaczeniem
  const currentTurn = currentPlayer ? t(`playerInfo.${currentPlayer.toLowerCase()}`) : t("playerInfo.white")

  // Renderowanie komponentu
  return (
    <div className="w-full py-6 px-8 z-10">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 border-2 border-white/20">
            <AvatarImage src={firstUserImage} /> {/* Awatar pierwszego gracza */}
            <AvatarFallback>{firstUserFallback}</AvatarFallback> {/* Fallback awatara */}
          </Avatar>
          <div>
            <p className={`font-medium text-lg ${textColor}`}>{firstUserName}</p> {/* Nazwa pierwszego gracza */}
            <p className={`text-sm ${mutedTextColor}`}>{t("playerInfo.playingWhite")}</p> {/* Informacja o kolorze */}
          </div>
          <div className={`ml-8 text-3xl font-mono ${timerBg} px-4 py-2 rounded-lg ${textColor}`}>
            {selectedColor === "black" ? whiteTimeDisplay : blackTimeDisplay} {/* Czas gry */}
          </div>
        </div>
        <div className={`text-3xl font-bold px-4 ${textColor}`}>VS</div> {/* Separator VS */}
        <div className="flex items-center gap-4">
          <div className={`mr-8 text-3xl font-mono ${timerBg} px-4 py-2 rounded-lg ${textColor}`}>
            {selectedColor === "black" ? blackTimeDisplay : whiteTimeDisplay} {/* Czas gry */}
          </div>
          <div className="text-right">
            <p className={`font-medium text-lg ${textColor}`}>{secondUserName}</p> {/* Nazwa drugiego gracza */}
            <p className={`text-sm ${mutedTextColor}`}>{t("playerInfo.playingBlack")}</p> {/* Informacja o kolorze */}
          </div>
          <Avatar className="w-12 h-12 border-2 border-white/20">
            <AvatarImage src={secondUserImage} /> {/* Awatar drugiego gracza */}
            <AvatarFallback>{secondUserFallback}</AvatarFallback> {/* Fallback awatara */}
          </Avatar>
        </div>
      </div>
      <div className={`text-center font-medium bg-background/30 py-2 mb-[1%] mt-[2%] rounded-lg max-w-xs mx-auto border`}>
        {gameStatus === "draw"
          ? "Remis" // Stan gry: remis
          : gameStatus === gameStatusType.whiteWins
            ? "Biały wygrał" // Stan gry: wygrana białych
            : gameStatus === gameStatusType.blackWins
              ? "Czarny wygrał" // Stan gry: wygrana czarnych
              : `${t("playerInfo.currentTurn")}: ${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1).toLowerCase()}`}{" "}
        {/* Aktualna tura */}
      </div>
    </div>
  )
}
