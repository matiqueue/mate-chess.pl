import type { Metadata } from "next"
import SettingsPage from "@/components/settings/settings"
/**
 * Metadane strony Chess Openings.
 *
 * @remarks
 * Autor: matiqueue (Jakub Batko)
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
 * Autor: matiqueue (Jakub Batko)
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <SettingsPage></SettingsPage>
    </main>
  )
}