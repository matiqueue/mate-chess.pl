// apps/web/app/layout.tsx
import { Providers } from "@/components/providers"
import { ClerkProvider } from "@clerk/nextjs"
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
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
