<<<<<<< HEAD
import { PrismaClient } from "@prisma/client"
=======
// lib/db/prisma.ts
import { PrismaClient } from '@prisma/client';
>>>>>>> e4acb22f827b8015832bc8a7b23dc7001016958f

// Zapewniamy, że podczas developmentu nie tworzymy wielu instancji PrismaClient
declare global {
<<<<<<< HEAD
  // Używamy var, aby rozszerzyć globalny interfejs i umożliwić przechowywanie instancji Prisma
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}

export default prisma
=======
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
>>>>>>> e4acb22f827b8015832bc8a7b23dc7001016958f
