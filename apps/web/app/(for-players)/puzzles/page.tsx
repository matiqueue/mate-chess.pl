import type { Metadata } from "next"
import PuzzlesClient from "./puzzles-client"
import { t } from "i18next"
/**
 * Metadane strony puzzli szachowych.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export const metadata: Metadata = {
  title: t("seo.puzzles.title"),
  description: t("seo.puzzles.description"),
}
/**
 * PuzzlesPage
 *
 * Komponent renderujący stronę puzzli szachowych. Zawartość strony jest dostarczana przez komponent PuzzlesClient.
 *
 * @returns {JSX.Element} Element JSX reprezentujący stronę puzzli.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export default function PuzzlesPage() {
  return (
    <>
      <PuzzlesClient />
    </>
  )
}
