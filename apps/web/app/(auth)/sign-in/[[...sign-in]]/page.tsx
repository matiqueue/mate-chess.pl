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
import { motion } from "framer-motion"
import RedirectCounter from "@/components/auth/signInRedirectCounter"
import { useTranslation } from "react-i18next"

/**
 * @remarks
 * Autor: awres (Filip Serwartka)
 * Autor: matiqueue (Szymon Góral)
 */

export default function SignInPage() {
  const { t } = useTranslation()

  return (
    <div className="z-10 grid w-full grow items-center px-4 sm:justify-center">
      <SignIn.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              {/* Krok 1: Start - identyfikator (email lub username) */}
              <SignIn.Step name="start">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                  <Card className="w-full sm:w-96 h-full">
                    <CardHeader>
                      <CardTitle className="text-xl">{t("signIn.title")}</CardTitle>
                      <CardDescription className="text-md">{t("signIn.welcomeMessage")}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-y-6">
                      {/* Logowanie społecznościowe */}
                      <div className="grid grid-cols-2 gap-x-4">
                        <Clerk.Connection name="google" asChild>
                          <Button className="p-5" size="sm" variant="outline" type="button" disabled={isGlobalLoading}>
                            <Clerk.Loading scope="provider:google">
                              {(isLoading) =>
                                isLoading ? (
                                  <Icons.spinner className="size-4 animate-spin" />
                                ) : (
                                  <>
                                    <Icons.google className="mr-2 size-4" />
                                    {t("signIn.google")}
                                  </>
                                )
                              }
                            </Clerk.Loading>
                          </Button>
                        </Clerk.Connection>

                        <Clerk.Connection name="apple" asChild>
                          <Button className="p-5" size="sm" variant="outline" type="button" disabled={isGlobalLoading}>
                            <Clerk.Loading scope="provider:apple">
                              {(isLoading) =>
                                isLoading ? (
                                  <Icons.spinner className="size-4 animate-spin" />
                                ) : (
                                  <>
                                    <Icons.apple className="mr-2 size-4" />
                                    {t("signIn.apple")}
                                  </>
                                )
                              }
                            </Clerk.Loading>
                          </Button>
                        </Clerk.Connection>
                      </div>
                      <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                        {t("signIn.or")}
                      </p>

                      {/* Pole identyfikator (email lub username) */}
                      <Clerk.Field name="identifier" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label className="text-md">{t("signIn.emailOrUsername")}</Label>
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
                            <Clerk.Loading>
                              {(isLoading) => (isLoading ? <Icons.spinner className="size-4 animate-spin" /> : t("signIn.continueButton"))}
                            </Clerk.Loading>
                          </Button>
                        </SignIn.Action>
                        <Button variant="link" size="sm" asChild>
                          <Link href="/sign-up">{t("signIn.signUpLink")}</Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              </SignIn.Step>
              {/* Krok 2: Wybór strategii */}
              <SignIn.Step name="choose-strategy">
                <Card className="w-full sm:w-96">
                  <CardHeader>
                    <CardTitle>{t("signIn.chooseOtherMethod")}</CardTitle>
                    <CardDescription>{t("signIn.verificationMessage")}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    <SignIn.SupportedStrategy name="email_code" asChild>
                      <Button type="button" variant="link" disabled={isGlobalLoading}>
                        {t("signIn.emailCode")}
                      </Button>
                    </SignIn.SupportedStrategy>
                    <SignIn.SupportedStrategy name="password" asChild>
                      <Button type="button" variant="link" disabled={isGlobalLoading}>
                        {t("signIn.password")}
                      </Button>
                    </SignIn.SupportedStrategy>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignIn.Action navigate="previous" asChild>
                        <Button disabled={isGlobalLoading}>
                          <Clerk.Loading>
                            {(isLoading) => (isLoading ? <Icons.spinner className="size-4 animate-spin" /> : t("signIn.backButton"))}
                          </Clerk.Loading>
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
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <Card className="w-full sm:w-96">
                      <CardHeader>
                        <CardTitle>{t("signIn.password")}</CardTitle>
                        <CardDescription>{t("signIn.verificationMessage")}</CardDescription>
                        <p className="text-sm text-muted-foreground">
                          {t("signIn.welcomeMessage")} <SignIn.SafeIdentifier />
                        </p>
                      </CardHeader>
                      <CardContent className="grid gap-y-4">
                        <Clerk.Field name="password" className="space-y-2">
                          <Clerk.Label asChild>
                            <Label>{t("signIn.password")}</Label>
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
                              <Clerk.Loading>
                                {(isLoading) => (isLoading ? <Icons.spinner className="size-4 animate-spin" /> : t("signIn.continueButton"))}
                              </Clerk.Loading>
                            </Button>
                          </SignIn.Action>
                          <SignIn.Action navigate="choose-strategy" asChild>
                            <Button type="button" size="sm" variant="link">
                              {t("signIn.chooseOtherMethod")}
                            </Button>
                          </SignIn.Action>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </SignIn.Strategy>

                {/* Strategia: Kod email */}
                <SignIn.Strategy name="email_code">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <Card className="w-full sm:w-96">
                      <CardHeader>
                        <CardTitle>{t("signIn.emailCode")}</CardTitle>
                        <CardDescription>{t("signIn.verificationMessage")}</CardDescription>
                        <p className="text-sm text-muted-foreground">
                          {t("signIn.welcomeMessage")} <SignIn.SafeIdentifier />
                        </p>
                      </CardHeader>
                      <CardContent className="grid gap-y-4">
                        <Clerk.Field name="code" className="space-y-2">
                          <Clerk.Label className="sr-only">{t("signIn.code")}</Clerk.Label>
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
                                {t("signIn.noCodeReceived")} (<span className="tabular-nums">{resendableAfter}</span>)
                              </Button>
                            )}
                          >
                            <Button type="button" variant="link" size="sm">
                              {t("signIn.noCodeReceived")}
                            </Button>
                          </SignIn.Action>
                        </Clerk.Field>
                      </CardContent>
                      <CardFooter>
                        <div className="grid w-full gap-y-4">
                          <SignIn.Action submit asChild>
                            <Button disabled={isGlobalLoading}>
                              <Clerk.Loading>
                                {(isLoading) => (isLoading ? <Icons.spinner className="size-4 animate-spin" /> : t("signIn.continueButton"))}
                              </Clerk.Loading>
                            </Button>
                          </SignIn.Action>
                          <SignIn.Action navigate="choose-strategy" asChild>
                            <Button type="button" size="sm" variant="link">
                              {t("signIn.chooseOtherMethod")}
                            </Button>
                          </SignIn.Action>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </SignIn.Strategy>
              </SignIn.Step>

              <SignIn.Step name="sso-callback">
                <Card className="w-full sm:w-96">
                  <CardHeader>
                    <CardTitle>{t("signIn.noAccountTitle")}</CardTitle>
                    <CardDescription>{t("signIn.redirectDescription")}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    {t("signIn.redirectMessage")} <RedirectCounter></RedirectCounter>
                  </CardContent>
                </Card>
              </SignIn.Step>
            </>
          )}
        </Clerk.Loading>
      </SignIn.Root>
    </div>
  )
}
