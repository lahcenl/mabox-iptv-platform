import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

// Let's log this to Vercel runtime logs so we can see if it's missing!
console.log("RUNTIME DB URL CHECK:", connectionString ? "✅ IT EXISTS" : "❌ IT IS MISSING/UNDEFINED");

const pool = new Pool({ connectionString: connectionString || '' });
const adapter = new PrismaNeon(pool as any);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ 
    adapter,
    // Forcefully inject the URL directly into the client
    datasourceUrl: connectionString 
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
