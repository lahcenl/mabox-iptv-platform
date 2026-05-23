import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

if (typeof window === 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaNeon(pool as any);
    prisma = new PrismaClient({
      adapter,
      // @ts-ignore - explicitly passing datasources for vercel build
      datasources: { db: { url: process.env.DATABASE_URL } },
    });
  } else {
    if (!globalForPrisma.prisma) {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      const adapter = new PrismaNeon(pool as any);
      globalForPrisma.prisma = new PrismaClient({
        adapter,
        // @ts-ignore - explicitly passing datasources for vercel build
        datasources: { db: { url: process.env.DATABASE_URL } },
        log: ['query', 'error', 'warn'],
      });
    }
    prisma = globalForPrisma.prisma;
  }
} else {
  // Mock client for any accidental client-side imports
  prisma = {} as PrismaClient;
}

export { prisma };
