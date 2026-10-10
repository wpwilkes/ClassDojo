import { prismaClient } from '../lib/prisma.js';

export async function pingDatabaseRepository(): Promise<string> {
  return await prismaClient.$queryRaw`SELECT CURRENT_TIMESTAMP;`;
}
