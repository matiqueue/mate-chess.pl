import type { Metadata } from "next"
import SettingsPage from "@/components/settings/settings"
/**
 * Metadane strony Chess Openings.
 *
 * @remarks
 * Autor: Jakub Batko (Jakub Batko)
 */
export const metadata: Metadata = {
  title: "Settings| Mate-Chess",
  description: "Change visuals according to your preferences!",
}

/**
 * Home
 *
 * Komponent główny strony, który renderuje sekcję ustawień użytkownika.
 *
 * @returns {JSX.Element} Element JSX reprezentujący stronę ustawień.
 *
 * @remarks
 * Autor: Jakub Batko (Jakub Batko)
 */
export default function Home() {
  return (
    <div className="flex w-full h-full">
      <div className="w-full flex items-center justify-center">
        <div className="w-full h-full max-w-4xl p-6">
          <SettingsPage></SettingsPage>
        </div>
      </div>
    </div>
    
  )
}
