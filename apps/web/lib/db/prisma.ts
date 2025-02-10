// lib/db/prisma.ts
import { PrismaClient } from '@prisma/client';

// Zapewniamy, że podczas developmentu nie tworzymy wielu instancji PrismaClient
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
