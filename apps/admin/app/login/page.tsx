"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Debug: Wyświetl zmienne środowiskowe w konsoli
    console.log("NEXT_PUBLIC_ADMIN_USERNAME:", process.env.NEXT_PUBLIC_ADMIN_USERNAME)
    console.log("NEXT_PUBLIC_ADMIN_PASSWORD:", process.env.NEXT_PUBLIC_ADMIN_PASSWORD)
    console.log("Wpisane username:", username)
    console.log("Wpisane password:", password)

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
    <div style={{ padding: "20px" }}>
      <h1>Logowanie do panelu admina</h1>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Zaloguj</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}
