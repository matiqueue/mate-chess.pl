"use client"

import { ClerkProvider, useUser } from "@clerk/nextjs"
import { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <DynamicMetadataWrapper>{children}</DynamicMetadataWrapper>
    </ClerkProvider>
  )
}

function DynamicMetadataWrapper({ children }: { children: ReactNode }) {
  const { user } = useUser()

  if (user) {
    document.title = ` ${user.firstName || user.fullName || "User"}'s Profile`
  }

  return <>{children}</>
}
