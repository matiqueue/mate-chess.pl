// prisma/seed.ts
import prisma from "@/lib/db/prisma"

async function main() {
  const testProfile = await prisma.userProfile.upsert({
    where: { clerkUserId: "user_2tBn9Ets2JkkB148fyichluSPFT" },
    update: {},
    create: {
      clerkUserId: "user_2tBn9Ets2JkkB148fyichluSPFT",
      gamesPlayed: 150,
      winPercentage: 65,
      eloPoints: 1850,
      timePlayed: new Date("2025-02-15T00:00:00Z"),
      nickname: "johnd",
      joinDate: "2023-01-15",
      avatar: "/placeholder.svg",
      name: "John Doe",
      lastGames: {
        create: [
          { result: "Win", opponent: "Alice", eloChange: "+15" },
          { result: "Loss", opponent: "Bob", eloChange: "-10" },
          { result: "Win", opponent: "Charlie", eloChange: "+12" },
          { result: "Win", opponent: "David", eloChange: "+14" },
          { result: "Loss", opponent: "Eve", eloChange: "-8" },
        ],
      },
    },
  })

  console.log("Seeded profile:", testProfile)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
