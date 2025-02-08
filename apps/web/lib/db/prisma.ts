import { PrismaClient } from "@prisma/client"

declare global {
  // Używamy var, aby rozszerzyć globalny interfejs i umożliwić przechowywanie instancji Prisma
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}

export default prisma
