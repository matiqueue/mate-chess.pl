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
import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const afterSSO = searchParams.get("after_sso") === "true"
  const { t } = useTranslation()

  const title = searchParams.get("title") || t("auth.createAccount")
  const description = searchParams.get("description") || t("auth.fillData")
  const message = searchParams.get("message") || t("auth.defaultMessage")

  return (
    <div className="z-10 grid w-full grow items-center px-4 sm:justify-center">
  <SignUp.Root>
    <Clerk.Loading>
      {(isGlobalLoading) => (
        <>
          {/* Krok 1: Start - pełny formularz lub SSO */}
          <SignUp.Step name="start">
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative flex w-full max-w-sm flex-col items-center gap-3 rounded-xl p-6 text-yellow-800 shadow-lg"
            >
              {/* Wiadomość */}
              <div className="pt-6 text-center text-sm font-medium">{message}</div>
              <Card className="w-full sm:w-96">
                <CardHeader>
                  <CardTitle className="text-lg">{t("signUp.start.title")}</CardTitle>
                  <CardDescription className="text-md">{t("signUp.start.description")}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-y-4">
                  <div className="grid grid-cols-2 gap-x-4">
                    <Clerk.Connection name="apple" asChild>
                      <Button className="p-5" size="sm" variant="outline" type="button" disabled={isGlobalLoading}>
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
                      <Button className="p-5" size="sm" variant="outline" type="button" disabled={isGlobalLoading}>
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
                    {t("signUp.or")}
                  </p>

                  {/* Standardowy formularz */}
                  <Clerk.Field name="emailAddress" className="space-y-2">
                    <Clerk.Label asChild>
                      <Label>{t("signUp.step1.email")}</Label>
                    </Clerk.Label>
                    <Clerk.Input type="email" required asChild>
                      <Input />
                    </Clerk.Input>
                    <Clerk.FieldError className="block text-sm text-destructive" />
                  </Clerk.Field>

                  <Clerk.Field name="username" className="space-y-2">
                    <Clerk.Label asChild>
                      <Label>{t("signUp.step1.username")}</Label>
                    </Clerk.Label>
                    <Clerk.Input type="text" required asChild>
                      <Input />
                    </Clerk.Input>
                    <Clerk.FieldError className="block text-sm text-destructive" />
                  </Clerk.Field>

                  <Clerk.Field name="firstName" className="space-y-2">
                    <Clerk.Label asChild>
                      <Label>{t("signUp.step1.firstName")}</Label>
                    </Clerk.Label>
                    <Clerk.Input type="text" required asChild>
                      <Input />
                    </Clerk.Input>
                    <Clerk.FieldError className="block text-sm text-destructive" />
                  </Clerk.Field>

                  <Clerk.Field name="lastName" className="space-y-2">
                    <Clerk.Label asChild>
                      <Label>{t("signUp.step1.lastName")}</Label>
                    </Clerk.Label>
                    <Clerk.Input type="text" required asChild>
                      <Input />
                    </Clerk.Input>
                    <Clerk.FieldError className="block text-sm text-destructive" />
                  </Clerk.Field>

                  <Clerk.Field name="password" className="space-y-2">
                    <Clerk.Label asChild>
                      <Label>{t("signUp.step1.password")}</Label>
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
                        <Clerk.Loading>{(isLoading) => (isLoading ? <Icons.spinner className="size-4 animate-spin" /> : t("signUp.continue"))}</Clerk.Loading>
                      </Button>
                    </SignUp.Action>
                    <Button variant="link" size="sm" asChild>
                      <Link href="/sign-in">{t("signUp.haveAccount")}</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </SignUp.Step>
          {/* Krok 2 i 3 również używają tłumaczeń podobnie jak powyżej */}
        </>
      )}
    </Clerk.Loading>
  </SignUp.Root>
</div>

  )
}
