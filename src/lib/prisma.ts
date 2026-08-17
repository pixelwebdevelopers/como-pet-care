import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { env } from './env';
import { logger } from './logger';

// Prevent multiple instances of Prisma Client in development due to hot-reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  adapter: PrismaMariaDb | undefined;
};

let prismaInstance: PrismaClient;

if (typeof window === 'undefined') {
  // Parse configuration dynamically from the database connection URL
  const dbUrl = new URL(env.DATABASE_URL);
  const host = dbUrl.hostname || 'localhost';
  const port = dbUrl.port ? parseInt(dbUrl.port, 10) : 3306;
  const user = decodeURIComponent(dbUrl.username);
  const password = decodeURIComponent(dbUrl.password);
  const database = decodeURIComponent(dbUrl.pathname.substring(1));
  const connectionLimit = dbUrl.searchParams.get('connection_limit')
    ? parseInt(dbUrl.searchParams.get('connection_limit')!, 10)
    : 5;

  const adapter =
    globalForPrisma.adapter ??
    new PrismaMariaDb({
      host,
      port,
      user,
      password,
      database,
      connectionLimit,
    });

  if (env.NODE_ENV !== 'production') {
    globalForPrisma.adapter = adapter;
  }

  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
      log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
    });

  if (env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }

  // Graceful shutdown: close connection pools on process termination
  const disconnectDb = async (signal: string) => {
    logger.info(`Received ${signal}. Cleaning up database connections...`);
    try {
      await prismaInstance.$disconnect();
      logger.info('Database connection closed cleanly.');
    } catch (error) {
      logger.error('Error during database disconnection:', error);
    }
  };

  process.once('SIGINT', () => {
    disconnectDb('SIGINT').finally(() => process.exit(0));
  });

  process.once('SIGTERM', () => {
    disconnectDb('SIGTERM').finally(() => process.exit(0));
  });
} else {
  // Satisfy runtime imports in browser components
  prismaInstance = {} as unknown as PrismaClient;
}

export const prisma = prismaInstance;
export default prisma;
