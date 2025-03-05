"use client"

import { ClerkProvider, useUser } from "@clerk/nextjs"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()

  if (user) {
    document.title = ` ${user.firstName || user.fullName || "User"}'s Profile`
  }

  return <ClerkProvider>{children}</ClerkProvider>
}
