import { PrismaClient } from "@prisma/client"

// Zapewniamy, że podczas developmentu nie tworzymy wielu instancji PrismaClient
declare global {
  // Używamy var, aby rozszerzyć globalny interfejs i umożliwić przechowywanie instancji Prisma
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma ?? new PrismaClient()


export default prisma
