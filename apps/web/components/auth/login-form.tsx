/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>

      <form onSubmit={handleSubmit}>
        <CardHeader className="text-center">
          <CardTitle className="text-5xl font-bold">Welcome back</CardTitle>
          <CardDescription className="primary">Login with your Apple or Google account</CardDescription>
        </CardHeader>
        <div className="grid gap-6">
          <Button variant="outline" className="w-full mt-2" onClick={handleAppleLogin}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 mr-2">
              <path 
                d="M16.5 1.8c-.9.7-1.8 1.9-1.6 3.2 1.2.1 2.4-.7 3.1-1.6.7-.9 1.3-2.2 1.1-3.4-1.1.1-2.3.7-3.1 1.8zm-3.3 4.6c-1.6 0-3.6 1-4.8 2.5C7.2 10.3 6.3 12.4 6.6 14.4c.1.4.1.7.2 1 .3 1.5 1 3.1 1.8 4.4.9 1.4 1.9 2.8 3.2 2.7 1.3 0 1.8-.9 3.4-.9s2 .9 3.3.9c1.4 0 2.4-1.3 3.3-2.7.8-1.2 1.2-1.9 1.6-3.3-4.3-1.7-5-7.9-.7-9.9-1.1-1.4-2.9-2.3-4.5-2.3-2.2 0-3.1 1-4.1 1z" 
                fill="currentColor"
              />
            </svg>
              Login with Apple
            </Button>
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
          </svg>
            Login with Google
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
        <div className="text-center text-sm p-3">
          Don&apos;t have an account?{" "}
          <a href="#" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      </form>
    </div>
  )
}
