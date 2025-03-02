"use client"
import * as Clerk from "@clerk/elements/common"
import * as SignUp from "@clerk/elements/sign-up"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Icons } from "@workspace/ui/components/icons"
import { cn } from "@workspace/ui/lib/utils"

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const afterSSO = searchParams.get("after_sso") === "true"

  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <SignUp.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              {/* Krok 1: Start - pełny formularz lub SSO */}
              <SignUp.Step name="start">
                <Card className="w-full sm:w-96">
                  <CardHeader>
                    <CardTitle>Stwórz swoje konto</CardTitle>
                    <CardDescription>Wypełnij dane, aby rozpocząć.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    {/* Logowanie społecznościowe */}
                    <div className="grid grid-cols-2 gap-x-4">
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
                    </div>
                    <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                      lub
                    </p>

                    {/* Standardowy formularz */}
                    <Clerk.Field name="emailAddress" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Adres email</Label>
                      </Clerk.Label>
                      <Clerk.Input type="email" required asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>

                    <Clerk.Field name="username" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Nazwa użytkownika</Label>
                      </Clerk.Label>
                      <Clerk.Input type="text" required asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>

                    <Clerk.Field name="firstName" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Imię</Label>
                      </Clerk.Label>
                      <Clerk.Input type="text" required asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>

                    <Clerk.Field name="lastName" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Nazwisko</Label>
                      </Clerk.Label>
                      <Clerk.Input type="text" required asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>

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
                      <SignUp.Captcha className="empty:hidden" />
                      <SignUp.Action submit asChild>
                        <Button disabled={isGlobalLoading}>
                          <Clerk.Loading>{(isLoading) => (isLoading ? <Icons.spinner className="size-4 animate-spin" /> : "Kontynuuj")}</Clerk.Loading>
                        </Button>
                      </SignUp.Action>
                      <Button variant="link" size="sm" asChild>
                        <Link href="/sign-in">Masz już konto? Zaloguj się</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </SignUp.Step>

              {/* Krok 2: Continue - tylko username po SSO */}
              <SignUp.Step name="continue">
                <Card className="w-full sm:w-96">
                  <CardHeader>
                    <CardTitle>Uzupełnij rejestrację</CardTitle>
                    <CardDescription>
                      {afterSSO
                        ? "Zalogowano Cię za pomocą konta społecznościowego. Podaj nazwę użytkownika, aby ukończyć rejestrację."
                        : "Podaj nazwę użytkownika, aby ukończyć tworzenie konta."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    <Clerk.Field name="username" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Nazwa użytkownika</Label>
                      </Clerk.Label>
                      <Clerk.Input type="text" required asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignUp.Action submit asChild>
                        <Button disabled={isGlobalLoading}>
                          <Clerk.Loading>
                            {(isLoading) => (isLoading ? <Icons.spinner className="size-4 animate-spin" /> : "Zakończ rejestrację")}
                          </Clerk.Loading>
                        </Button>
                      </SignUp.Action>
                    </div>
                  </CardFooter>
                </Card>
              </SignUp.Step>

              {/* Krok 3: Weryfikacja emaila */}
              <SignUp.Step name="verifications">
                <SignUp.Strategy name="email_code">
                  <Card className="w-full sm:w-96">
                    <CardHeader>
                      <CardTitle>Zweryfikuj swój email</CardTitle>
                      <CardDescription>Wprowadź kod weryfikacyjny wysłany na Twój email.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      <div className="grid items-center justify-center gap-y-2">
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
                        </Clerk.Field>
                        <SignUp.Action
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
                        </SignUp.Action>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignUp.Action submit asChild>
                          <Button disabled={isGlobalLoading}>
                            <Clerk.Loading>{(isLoading) => (isLoading ? <Icons.spinner className="size-4 animate-spin" /> : "Kontynuuj")}</Clerk.Loading>
                          </Button>
                        </SignUp.Action>
                      </div>
                    </CardFooter>
                  </Card>
                </SignUp.Strategy>
              </SignUp.Step>
            </>
          )}
        </Clerk.Loading>
      </SignUp.Root>
    </div>
  )
}
