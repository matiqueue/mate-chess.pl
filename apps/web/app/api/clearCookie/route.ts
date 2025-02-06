// app/api/clearCookie/route.ts
import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ message: "Cookie cleared" })
  // Usuwamy ciasteczko "visitedHome" (ustawiając je na wygasłe)
  response.cookies.delete("visitedHome")
  return response
}
