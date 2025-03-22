import StatiscticsPage from "@/components/statistics/statistics-page"

/**
 * Page
 *
 * Asynchroniczny komponent strony statystyk, renderujący StatiscticsPage.
 *
 * @returns {Promise<JSX.Element>} Element JSX reprezentujący stronę statystyk.
 *
 * @remarks
 * Autor: nasakrator (Kuba Batko)
 */
export default async function Page(): Promise<JSX.Element> {
  return <StatiscticsPage />
}
