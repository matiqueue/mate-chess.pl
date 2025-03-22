"use client"

import { useState } from "react" // Import hooka useState
import { useRouter } from "next/navigation" // Import hooka useRouter
import { Button } from "@workspace/ui/components/button" // Import komponentu Button
import { Input } from "@workspace/ui/components/input" // Import komponentu Input
import { Label } from "@workspace/ui/components/label" // Import komponentu Label
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card" // Import komponentów Card

/**
 * Komponent LoginPage
 *
 * Renderuje stronę logowania panelu administracyjnego.
 * Umożliwia wprowadzenie nazwy użytkownika oraz hasła, a w przypadku poprawnych danych zapisuje flagę logowania
 * i przekierowuje użytkownika do panelu admina.
 *
 * @returns {JSX.Element} Element JSX reprezentujący stronę logowania.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export default function LoginPage(): JSX.Element {
  // Stan przechowujący wprowadzoną nazwę użytkownika.
  const [username, setUsername] = useState("")
  // Stan przechowujący wprowadzone hasło.
  const [password, setPassword] = useState("")
  // Stan przechowujący komunikat błędu.
  const [error, setError] = useState("")

  // Hook do nawigacji.
  const router = useRouter()

  /**
   * handleSubmit
   *
   * Obsługuje zdarzenie wysłania formularza logowania.
   * Porównuje dane wejściowe z wartościami przechowywanymi w zmiennych środowiskowych
   * NEXT_PUBLIC_ADMIN_USERNAME oraz NEXT_PUBLIC_ADMIN_PASSWORD.
   * W przypadku zgodności zapisuje flagę logowania w localStorage i przekierowuje do panelu admina,
   * a w przeciwnym razie ustawia komunikat błędu.
   *
   * @param {React.FormEvent} e - Zdarzenie formularza.
   *
   * @remarks
   * Autor: matiqueue (Szymon Góral)
   */
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
