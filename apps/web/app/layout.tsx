// apps/web/app/layout.tsx
import { Providers } from "@/components/providers"
import { ClerkProvider } from "@clerk/nextjs"
import { ErrorContextProvider } from "@/contexts/ErrorContextProvider" // Poprawiona ścieżka
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mate Chess",
  description: "A chess application",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <Providers>
            <ErrorContextProvider>{children}</ErrorContextProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
