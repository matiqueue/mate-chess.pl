"use client"

import { useState, useEffect } from "react" // Import hooków useState i useEffect
import { useRouter } from "next/navigation" // Import hooka useRouter
import io, { Socket } from "socket.io-client" // Import biblioteki socket.io-client
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs" // Import komponentów zakładek
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table" // Import komponentów tabeli
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card" // Import komponentów karty
import { Badge } from "@workspace/ui/components/badge" // Import komponentu Badge
import { Button } from "@workspace/ui/components/button" // Import komponentu Button

/**
 * Komponent AdminPage
 *
 * Renderuje panel administracyjny z zakładkami "Użytkownicy" oraz "Logi".
 * W zależności od wybranej zakładki wyświetla odpowiednio listę użytkowników lub logi systemowe.
 *
 * @returns {JSX.Element} Element JSX reprezentujący stronę administracyjną.
 *
 * @remarks
 * Autor: matiqueue (Szymon Góral)
 */
export default function AdminPage(): JSX.Element {
  // Stan aktywnej zakładki: "users" lub "logs".
  const [activeTab, setActiveTab] = useState<"users" | "logs">("users")

  // Stan logów systemowych jako tablica stringów.
  const [logs, setLogs] = useState<string[]>([])

  // Stan obiektu Socket dla komunikacji WebSocket.
  const [socket, setSocket] = useState<Socket | null>(null)

  // Hook do nawigacji pomiędzy stronami.
  const router = useRouter()

  // Maksymalna liczba logów do przechowywania.
  const MAX_LOGS = 200

  /**
   * Lista użytkowników systemu.
   * Każdy użytkownik posiada: id, name, email, role oraz status.
   */
  const users = [
    { id: 1, name: "Jan Kowalski", email: "jan@example.com", role: "Admin", status: "Aktywny" },
    { id: 2, name: "Anna Nowak", email: "anna@example.com", role: "Edytor", status: "Aktywny" },
    { id: 3, name: "Piotr Wiśniewski", email: "piotr@example.com", role: "Użytkownik", status: "Nieaktywny" },
    { id: 4, name: "Magdalena Dąbrowska", email: "magda@example.com", role: "Edytor", status: "Aktywny" },
    { id: 5, name: "Tomasz Lewandowski", email: "tomasz@example.com", role: "Użytkownik", status: "Aktywny" },
  ]

  useEffect(() => {
    // Jeśli wybrana zakładka to "logs", ustanawiamy połączenie WebSocket z serwerem logów.
    if (activeTab === "logs") {
      // Inicjalizacja nowego połączenia socket.io z serwerem logów.
      const newSocket = io("http://localhost:4000/admin-logs", {
        reconnection: true,
        transports: ["websocket"],
      })

      // Po udanym połączeniu, wypisuje komunikat do konsoli.
      newSocket.on("connect", () => {
        console.log("Połączono z serwerem logów przez WebSocket")
      })

      // Ustawia początkową listę logów, ograniczając ich liczbę do MAX_LOGS.
      newSocket.on("initial_logs", (initialLogs: string[]) => {
        setLogs(initialLogs.slice(-MAX_LOGS))
      })

      // Dodaje nowe logi do stanu; jeśli przekroczona liczba MAX_LOGS, zachowuje tylko najnowsze.
      newSocket.on("log", (message: string) => {
        setLogs((prevLogs) => {
          const updatedLogs = [...prevLogs, message]
          return updatedLogs.length > MAX_LOGS ? updatedLogs.slice(-MAX_LOGS) : updatedLogs
        })
      })

      // Loguje błędy połączenia.
      newSocket.on("connect_error", (error) => {
        console.error("Błąd połączenia Socket.IO:", error.message)
      })

      setSocket(newSocket)

      // Przy czyszczeniu efektu rozłączamy socket.
      return () => {
        newSocket.disconnect()
        setSocket(null)
      }
    }
  }, [activeTab]) // Efekt uruchamia się przy zmianie aktywnej zakładki.

  /**
   * handleLogout
   *
   * Usuwa informację o zalogowaniu z localStorage i przekierowuje użytkownika na stronę logowania.
   *
   * @remarks
   * Autor: matiqueue (Szymon Góral)
   * @note ta funkcja jest zrobiona z AI
   */
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn") // Usuwa flagę zalogowania.
    router.push("/login") // Przekierowuje do strony logowania.
  }

  return (
    <div className="min-h-screen text-foreground">
      <div className="container mx-auto p-8">
        {/* Panel nagłówka z tytułem oraz przyciskiem wylogowania */}
        <Card className="mb-8 border-border bg-card shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="text-center flex-1">
              <CardTitle className="text-3xl font-bold text-foreground">Panel Admina</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">Zarządzaj użytkownikami i przeglądaj logi systemowe</CardDescription>
            </div>
            <Button onClick={handleLogout} className="rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20">
              Wyloguj się
            </Button>
          </CardHeader>
        </Card>

        {/* Zakładki: Użytkownicy i Logi */}
        <Tabs defaultValue="users" value={activeTab} onValueChange={(value) => setActiveTab(value as "users" | "logs")} className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-[350px] grid-cols-2 gap-1 rounded-xl">
              <TabsTrigger value="users" className="rounded font-medium transition-all data-[state=active]:font-bold data-[state=active]:bg-stone-900">
                Użytkownicy
              </TabsTrigger>
              <TabsTrigger value="logs" className="rounded font-medium transition-all data-[state=active]:font-bold data-[state=active]:bg-stone-900">
                Logi
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Zawartość zakładki Użytkownicy */}
          <TabsContent value="users" className="space-y-4">
            <Card className="border-border bg-card shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-foreground">Użytkownicy systemu</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">Lista wszystkich użytkowników zarejestrowanych w systemie</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption className="text-muted-foreground">Lista użytkowników systemu</TableCaption>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-center text-lg font-medium text-foreground">ID</TableHead>
                      <TableHead className="text-center text-lg font-medium text-foreground">Nazwa</TableHead>
                      <TableHead className="text-center text-lg font-medium text-foreground">Email</TableHead>
                      <TableHead className="text-center text-lg font-medium text-foreground">Rola</TableHead>
                      <TableHead className="text-center text-lg font-medium text-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-border">
                        <TableCell className="text-center text-lg text-foreground">{user.id}</TableCell>
                        <TableCell className="text-center text-lg text-foreground">{user.name}</TableCell>
                        <TableCell className="text-center text-lg text-foreground">{user.email}</TableCell>
                        <TableCell className="text-center text-lg text-foreground">{user.role}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={user.status === "Aktywny" ? "default" : "destructive"}>{user.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Zawartość zakładki Logi */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-foreground">Logi systemowe</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">Historia działań w systemie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-base rounded-xl border-border bg-card p-6 h-[600px] overflow-y-auto shadow-inner">
                  {logs.map((log, index) => (
                    <div key={index} className="py-3 border-b border-border last:border-0">
                      <span className="text-foreground">{log}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
