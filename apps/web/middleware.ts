import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  const { pathname } = req.nextUrl

  // Zawsze przekierowujemy ze ścieżki głównej "/" na "/home"
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url))
  }

  // Ochrona ścieżek /play/online i dowolnych podścieżek:
  // Jeśli użytkownik nie jest zalogowany, zostanie przekierowany na stronę logowania.
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
