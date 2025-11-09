import { PrismaClient } from "@/generated/prisma";

// prisma... soha többet a sírás keringtet hogy miért nem akar mukodni a singleton

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });


if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

if (process.env.NODE_ENV !== "test") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}

export default prisma;