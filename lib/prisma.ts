import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// Enable WebSockets for Node.js environments (Vercel & Local)
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// كنجبدو الرابط بأمان باش مايطيحش السيرفر إيلا تعطل
const connectionString = process.env.DATABASE_URL || '';

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool as any);

// كنصاوبو Client واحد باش مانخنقوش الداتابيز
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
