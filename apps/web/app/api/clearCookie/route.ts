import { NextResponse } from "next/server"

/**
 * POST handler for the /api/clearCookie route.
 *
 * Usuwa ciasteczko "visitedHome" przez ustawienie go jako wygasłe.
 *
 * @returns {NextResponse} Odpowiedź JSON z komunikatem o usunięciu ciasteczka.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export async function POST() {
  const response = NextResponse.json({ message: "Cookie cleared" })
  // Usuwamy ciasteczko "visitedHome" (ustawiając je na wygasłe)
  response.cookies.delete("visitedHome")
  return response
}
