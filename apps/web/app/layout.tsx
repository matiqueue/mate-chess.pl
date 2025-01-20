import "@workspace/ui/globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <section>{children}</section>
      </body>
    </html>
  )
}
