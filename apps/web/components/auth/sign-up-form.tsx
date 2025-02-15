"use client"

import { useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { useSignUp } from "@clerk/nextjs"
import Link from "next/link"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp"
import { verify } from "crypto"

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {

  const { signUp, setActive } = useSignUp();

  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState<string | any>("")
  const [step, setStep] = useState<"register" | "verify" >("register");
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true);
    setError(null)

    try {
      if (!signUp) throw new Error("Clerk SignUp not initialized");

      console.log(userName, email, password)

      const result = await signUp?.create({
        emailAddress: email,
        username: userName,
        password: password,
      });

      await signUp?.prepareEmailAddressVerification({
        strategy: "email_code"
      })

      console.log("Clerk SignUp Result:", result);
      console.log("SignUp Status:", result?.status);


      if (result.status as string === "needs_verification") {
        setStep("verify"); // Przechodzimy do etapu weryfikacji
      }

    } catch (err) {
      const error = err as { errors?: { message: string }[] };
      setError(error.errors?.[0]?.message || "Błąd rejestracji");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true)
    setError(null)

    try{
      const result = await signUp?.attemptVerification({
        strategy: "email_code",
        code
      })

      if(!result) {
        throw new Error("Account can't be created")
      }

      if (result.status === "complete") {
        await setActive?.({ session: result.createdSessionId });
        window.location.href = "/home"; // Przekierowanie po rejestracji
      } else {
        throw new Error("Nie udało się zweryfikować konta");
      }



    }catch (err) {
      const error = err as { errors?: { message: string }[] };
      setError(error.errors?.[0]?.message || "Błąd weryfikacji");
    } finally {
      setIsLoading(false);
    }

  }

  async function handleGoogleSignUp() {
    await signUp?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: window.location.origin + "/home",
      redirectUrlComplete: window.location.origin + "/home",
    })
  }

  async function handleAppleSignUp() {
    await signUp?.authenticateWithRedirect({
      strategy: "oauth_apple",
      redirectUrl: window.location.origin + "/home", 
      redirectUrlComplete: window.location.origin + "/home",
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>

      <div className="grid gap-2">
        <CardHeader className="text-center">
          <CardTitle className="text-5xl font-bold">Let's Get Started!</CardTitle>
          <CardDescription className="primary">Register with your Apple or Google account</CardDescription>
        </CardHeader>
        
        <Button variant="outline" className="w-full mt-2" onClick={handleAppleSignUp}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 mr-2">
                <path
                  d="M16.5 1.8c-.9.7-1.8 1.9-1.6 3.2 1.2.1 2.4-.7 3.1-1.6.7-.9 1.3-2.2 1.1-3.4-1.1.1-2.3.7-3.1 1.8zm-3.3 4.6c-1.6 0-3.6 1-4.8 2.5C7.2 10.3 6.3 12.4 6.6 14.4c.1.4.1.7.2 1 .3 1.5 1 3.1 1.8 4.4.9 1.4 1.9 2.8 3.2 2.7 1.3 0 1.8-.9 3.4-.9s2 .9 3.3.9c1.4 0 2.4-1.3 3.3-2.7.8-1.2 1.2-1.9 1.6-3.3-4.3-1.7-5-7.9-.7-9.9-1.1-1.4-2.9-2.3-4.5-2.3-2.2 0-3.1 1-4.1 1z"
                  fill="currentColor"
                />
              </svg>
              Register with Apple
            </Button>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignUp}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Register with Google
            </Button>
      </div>

      <form onSubmit={handleSignUp} className={step === "register"? "" : "hidden"}>
        <div className="grid gap-6">

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Username</Label>
            <Input id="username" type="text" placeholder="blackestking123" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            Register
          </Button>
          <div id="clerk-captcha" className="w-full"></div>
        </div>
      </form>

      <form onSubmit={handleVerify} className={step === "verify" ? "" : "hidden"}>

        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">Your one-time verification code</CardTitle>
          <CardDescription className="primary">has been sent to: {email}</CardDescription>
        </CardHeader>

        <div className="grid gap-2">
            <div className="flex justify-center">
            <InputOTP value={code} onChange={(value: string) => setCode(value)} maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            </div>

            <div className="text-center text-sm">
              Enter your one-time password.
            </div>

        </div>
        <div className="grid gap-2 mt-4" >
          <div className="flex justify-center">
            <Button type="submit" className="w-50">
              Verify
            </Button>
          </div>
        </div>

      </form>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/sign-in">
          <div className="underline underline-offset-4">Sign In</div>
        </Link>
      </div>
    </div>
  )
  }

