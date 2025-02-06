import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | any;
}

// Sprawdź, czy istnieje globalna instancja Prisma, aby zapobiec ponownemu tworzeniu jej w trybie dev
const prisma = global.prisma || new PrismaClient();

// W trybie dev przypisz klienta Prisma do zmiennej globalnej
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;