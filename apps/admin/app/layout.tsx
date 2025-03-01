import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Panel - Mate Chess",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  )
}
