// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

declare global {
  // W trybie deweloperskim używamy globalnego cache'a
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === "development") global.prisma = prisma

export default prisma
