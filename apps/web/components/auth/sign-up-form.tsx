/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { useState } from "react"
import { SignUpButton, useSignIn } from "@clerk/nextjs"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  // Upewniamy się, że hook zwraca dane – jeżeli nie, można np. zwrócić null
  const signInData = useSignIn()
  if (!signInData) return null
  const { signIn, setActive } = signInData

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const result = await signIn?.create({
        identifier: email,
        password: password,
      })
      // Upewnij się, że otrzymany identyfikator sesji nie jest undefined
      if (!result?.createdSessionId) {
        throw new Error("Nie udało się utworzyć sesji")
      }
      if (setActive) {
        await setActive({ session: result.createdSessionId })
      } else {
        throw new Error("setActive is undefined")
      }
      // Po udanym logowaniu przekierowujemy na /home
      window.location.href = "/home"
    } catch (err) {
      const error = err as { errors?: { message: string }[] }
      setError(error.errors?.[0]?.message || "Błąd logowania")
      setIsLoading(false)
    }
  }

  async function handleGoogleLogin() {
    try {
      await signIn?.authenticateWithRedirect({
        strategy: "oauth_google",
        // Ustawiamy docelowy URL na /home
        redirectUrl: window.location.origin + "/home",
        redirectUrlComplete: window.location.origin + "/home",
      })
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] }
      setError(error.errors?.[0]?.message || "Błąd logowania przez Google")
    }
  }

  async function handleAppleLogin() {
    try {
      await signIn?.authenticateWithRedirect({
        strategy: "oauth_apple",
        redirectUrl: window.location.origin + "/home",
        redirectUrlComplete: window.location.origin + "/home",
      })
    } catch (err) {
      const error = err as { errors?: { message: string }[] }
      setError(error.errors?.[0]?.message || "Błąd logowania przez Apple")
    }
  }

  return (
    <div>elo</div>
  )
}
