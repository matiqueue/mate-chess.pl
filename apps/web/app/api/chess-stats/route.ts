// app/api/chess-stats/route.ts
import { NextResponse } from "next/server"
import { getAuth } from "@clerk/nextjs/server"
import prisma from "@/lib/db/prisma"

export async function GET(req: Request) {
  const { userId } = getAuth(req)
  // Jeśli użytkownik nie jest zalogowany, używamy domyślnego id do celów testowych
  const effectiveUserId = userId || "user_2tBn9Ets2JkkB148fyichluSPFT"

  const profile = await prisma.userProfile.findUnique({
    where: { clerkUserId: effectiveUserId },
    include: { lastGames: true },
  })

  return NextResponse.json(profile)
}

export async function POST(req: Request) {
  const { userId } = getAuth(req)
  const effectiveUserId = userId || "user_2tBn9Ets2JkkB148fyichluSPFT"
  const data = await req.json()

  const existing = await prisma.userProfile.findUnique({
    where: { clerkUserId: effectiveUserId },
  })

  if (existing) {
    const updatedProfile = await prisma.userProfile.update({
      where: { clerkUserId: effectiveUserId },
      data,
    })
    return NextResponse.json(updatedProfile)
  } else {
    const newProfile = await prisma.userProfile.create({
      data: {
        clerkUserId: effectiveUserId,
        ...data,
      },
    })
    return NextResponse.json(newProfile)
  }
}
