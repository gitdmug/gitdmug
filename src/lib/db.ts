import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Production-safe Prisma/PostgreSQL client for Next.js/Vercel.
 *
 * Prisma 7's pg adapter creates the driver pool from this configuration. Keep
 * the client in the warm server global and explicitly cap the pool so a burst
 * of dynamic pages cannot create an unnecessarily large number of database
 * connections per Vercel instance.
 */
const globalForDb = globalThis as unknown as { gitdmDb?: PrismaClient };

function createDb() {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const adapter = new PrismaPg({
    connectionString,
    max: Number(process.env.DATABASE_POOL_MAX || 8),
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 10_000,
    query_timeout: 30_000,
    statement_timeout: 30_000,
    allowExitOnIdle: true,
  });

  return new PrismaClient({ adapter });
}

function createMockDb(): PrismaClient {
  console.warn('[AI Studio] Database not connected — using mock');
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    count: async () => 0,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    upsert: async (d: any) => d?.create ?? d?.update ?? {},
    delete: async () => ({}),
    deleteMany: async () => ({ count: 0 }),
    groupBy: async () => [],
    aggregate: async () => ({ _count: 0 }),
  };
  return new Proxy({} as PrismaClient, {
    get: (_target, prop) => {
      if (prop === '$connect' || prop === '$disconnect') return async () => {};
      if (prop === '$transaction') return async (fnOrArr: any) => Array.isArray(fnOrArr) ? Promise.all(fnOrArr) : (typeof fnOrArr === 'function' ? fnOrArr(createMockDb()) : []);
      if (prop === '$queryRaw' || prop === '$executeRaw') return async () => [];
      return noOp;
    },
  });
}

export function getDb() {
  if (!process.env.DATABASE_URL?.trim()) {
    return null;
  }
  try {
    if (!globalForDb.gitdmDb) {
      globalForDb.gitdmDb = createDb();
    }
    return globalForDb.gitdmDb;
  } catch (err) {
    console.warn('[AI Studio] Failed to connect to database, falling back to mock:', err);
    return createMockDb();
  }
}

/** @deprecated Prefer getDb() when database may be unavailable */
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getDb() || createMockDb();
    return Reflect.get(client, prop, receiver);
  },
});
