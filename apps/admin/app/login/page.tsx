"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

    if (username === adminUsername && password === adminPassword) {
      localStorage.setItem("isLoggedIn", "true")
      router.push("/admin")
    } else {
      setError("Nieprawidłowy login lub hasło")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md border-border bg-card shadow-2xl">
        <CardHeader className="space-y-3 pb-8 text-center">
          <CardTitle className="text-3xl font-bold text-foreground">Panel Administracyjny</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">Wprowadź swoje dane logowania</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pb-8">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-sm font-medium text-foreground">
                Nazwa użytkownika
              </Label>
              <Input
                id="username"
                placeholder="Wprowadź nazwę użytkownika"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="rounded-xl border-input bg-muted p-6 text-lg text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Hasło
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Wprowadź hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl border-input bg-muted p-6 text-lg text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            {error && <p className="text-center text-destructive">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full rounded-xl bg-accent px-8 py-6 text-lg font-medium text-accent-foreground hover:bg-accent/80">
              Zaloguj się
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
