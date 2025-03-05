import Link from "next/link"
import { Button } from "@workspace/ui/components/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-12 shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Panel Administracyjny</h1>
          <p className="mt-6 text-lg text-muted-foreground">Zaloguj się, aby uzyskać dostęp do panelu</p>
        </div>
        <div className="flex justify-center pt-4">
          <Button asChild className="w-full rounded-xl bg-accent px-8 py-6 text-lg font-medium text-accent-foreground hover:bg-accent/80">
            <Link href="/login">Zaloguj się do panelu</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
