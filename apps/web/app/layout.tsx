import "@workspace/ui/globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
