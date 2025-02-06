// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  const { pathname } = req.nextUrl

  // Gdy użytkownik odwiedza "/home", ustaw ciasteczko "visitedHome" (jeśli jeszcze nie istnieje)
  if (pathname === "/home") {
    const response = NextResponse.next()
    if (!req.cookies.has("visitedHome")) {
      response.cookies.set("visitedHome", "true", {
        maxAge: 60 * 60 * 24 * 7, // ważne przez 7 dni
        path: "/",
      })
    }
    return response
  }

  // Na stronie głównej "/" – jeśli ciasteczko "visitedHome" istnieje, przekieruj na "/home"
  if (pathname === "/") {
    if (req.cookies.has("visitedHome")) {
      return NextResponse.redirect(new URL("/home", req.url))
    }
  }

  // Ochrona ścieżek /play/online oraz podścieżek: jeśli użytkownik nie jest zalogowany, przekieruj na "/sign-in"
  if (pathname.startsWith("/play/online") && !userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Pomijamy Next.js internals oraz pliki statyczne
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Uruchamiamy middleware dla API/trpc
    "/(api|trpc)(.*)",
  ],
}
