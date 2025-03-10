//
//

"use client"
import * as Clerk from "@clerk/elements/common"
import * as SignIn from "@clerk/elements/sign-in"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Icons } from "@workspace/ui/components/icons"
import { cn } from "@workspace/ui/lib/utils"

export default function SignInPage() {
  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <SignIn.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              {/* Krok 1: Start - identyfikator (email lub username) */}
              <SignIn.Step name="start">
                <Card className="w-full sm:w-96">
                  <CardHeader>
                    <CardTitle>Zaloguj się</CardTitle>
                    <CardDescription>Witaj ponownie! Zaloguj się, aby kontynuować.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    {/* Logowanie społecznościowe */}
                    <div className="grid grid-cols-2 gap-x-4">
                      <Clerk.Connection name="google" asChild>
                        <Button size="sm" variant="outline" type="button" disabled={isGlobalLoading}>
                          <Clerk.Loading scope="provider:google">
                            {(isLoading) =>
                              isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                <>
                                  <Icons.google className="mr-2 size-4" />
                                  Google
                                </>
                              )
                            }
                          </Clerk.Loading>
                        </Button>
                      </Clerk.Connection>

                      <Clerk.Connection name="apple" asChild>
                        <Button size="sm" variant="outline" type="button" disabled={isGlobalLoading}>
                          <Clerk.Loading scope="provider:apple">
                            {(isLoading) =>
                              isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                <>
                                  <Icons.apple className="mr-2 size-4" />
                                  Apple
                                </>
                              )
                            }
                          </Clerk.Loading>
                        </Button>
                      </Clerk.Connection>
                    </div>
                    <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                      lub
                    </p>

                    {/* Pole identyfikator (email lub username) */}
                    <Clerk.Field name="identifier" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Email lub nazwa użytkownika</Label>
                      </Clerk.Label>
                      <Clerk.Input type="text" required asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignIn.Action submit asChild>
                        <Button disabled={isGlobalLoading}>
                          <Clerk.Loading>{(isLoading) => (isLoading ? <Icons.spinner className="size-4 animate-spin" /> : "Kontynuuj")}</Clerk.Loading>
                        </Button>
                      </SignIn.Action>
                      <Button variant="link" size="sm" asChild>
                        <Link href="/sign-up">Nie masz konta? Zarejestruj się</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </SignIn.Step>

              {/* Krok 2: Wybór strategii */}
              <SignIn.Step name="choose-strategy">
                <Card className="w-full sm:w-96">
                  <CardHeader>
                    <CardTitle>Użyj innej metody</CardTitle>
                    <CardDescription>Masz problem? Wybierz inną metodę logowania.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    <SignIn.SupportedStrategy name="email_code" asChild>
                      <Button type="button" variant="link" disabled={isGlobalLoading}>
                        Kod email
                      </Button>
                    </SignIn.SupportedStrategy>
                    <SignIn.SupportedStrategy name="password" asChild>
                      <Button type="button" variant="link" disabled={isGlobalLoading}>
                        Hasło
                      </Button>
                    </SignIn.SupportedStrategy>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignIn.Action navigate="previous" asChild>
                        <Button disabled={isGlobalLoading}>
                          <Clerk.Loading>{(isLoading) => (isLoading ? <Icons.spinner className="size-4 animate-spin" /> : "Wróć")}</Clerk.Loading>
                        </Button>
                      </SignIn.Action>
                    </div>
                  </CardFooter>
                </Card>
              </SignIn.Step>

              {/* Krok 3: Weryfikacje */}
              <SignIn.Step name="verifications">
                {/* Strategia: Hasło */}
                <SignIn.Strategy name="password">
                  <Card className="w-full sm:w-96">
                    <CardHeader>
                      <CardTitle>Podaj hasło</CardTitle>
                      <CardDescription>Wprowadź hasło dla swojego konta.</CardDescription>
                      <p className="text-sm text-muted-foreground">
                        Witaj z powrotem, <SignIn.SafeIdentifier />!
                      </p>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      <Clerk.Field name="password" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label>Hasło</Label>
                        </Clerk.Label>
                        <Clerk.Input type="password" required asChild>
                          <Input />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignIn.Action submit asChild>
                          <Button disabled={isGlobalLoading}>
                            <Clerk.Loading>{(isLoading) => (isLoading ? <Icons.spinner className="size-4 animate-spin" /> : "Kontynuuj")}</Clerk.Loading>
                          </Button>
                        </SignIn.Action>
                        <SignIn.Action navigate="choose-strategy" asChild>
                          <Button type="button" size="sm" variant="link">
                            Użyj innej metody
                          </Button>
                        </SignIn.Action>
                      </div>
                    </CardFooter>
                  </Card>
                </SignIn.Strategy>

                {/* Strategia: Kod email */}
                <SignIn.Strategy name="email_code">
                  <Card className="w-full sm:w-96">
                    <CardHeader>
                      <CardTitle>Sprawdź email</CardTitle>
                      <CardDescription>Wprowadź kod weryfikacyjny wysłany na Twój email.</CardDescription>
                      <p className="text-sm text-muted-foreground">
                        Witaj z powrotem, <SignIn.SafeIdentifier />!
                      </p>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      <Clerk.Field name="code" className="space-y-2">
                        <Clerk.Label className="sr-only">Kod weryfikacyjny</Clerk.Label>
                        <div className="flex justify-center text-center">
                          <Clerk.Input
                            type="otp"
                            className="flex justify-center has-[:disabled]:opacity-50"
                            autoSubmit
                            render={({ value, status }) => (
                              <div
                                data-status={status}
                                className={cn(
                                  "relative flex size-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
                                  {
                                    "z-10 ring-2 ring-ring ring-offset-background": status === "cursor" || status === "selected",
                                  },
                                )}
                              >
                                {value}
                                {status === "cursor" && (
                                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                    <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
                                  </div>
                                )}
                              </div>
                            )}
                          />
                        </div>
                        <Clerk.FieldError className="block text-center text-sm text-destructive" />
                        <SignIn.Action
                          asChild
                          resend
                          className="text-muted-foreground"
                          fallback={({ resendableAfter }) => (
                            <Button variant="link" size="sm" disabled>
                              Nie otrzymałeś kodu? Wyślij ponownie (<span className="tabular-nums">{resendableAfter}</span>)
                            </Button>
                          )}
                        >
                          <Button type="button" variant="link" size="sm">
                            Nie otrzymałeś kodu? Wyślij ponownie
                          </Button>
                        </SignIn.Action>
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignIn.Action submit asChild>
                          <Button disabled={isGlobalLoading}>
                            <Clerk.Loading>{(isLoading) => (isLoading ? <Icons.spinner className="size-4 animate-spin" /> : "Kontynuuj")}</Clerk.Loading>
                          </Button>
                        </SignIn.Action>
                        <SignIn.Action navigate="choose-strategy" asChild>
                          <Button type="button" size="sm" variant="link">
                            Użyj innej metody
                          </Button>
                        </SignIn.Action>
                      </div>
                    </CardFooter>
                  </Card>
                </SignIn.Strategy>
              </SignIn.Step>
            </>
          )}
        </Clerk.Loading>
      </SignIn.Root>
    </div>
  )
}
