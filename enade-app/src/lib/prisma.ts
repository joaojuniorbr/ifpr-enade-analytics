import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function currentClient(): PrismaClient | undefined {
	const existing = globalForPrisma.prisma;
	if (existing && 'fato_Respostas' in existing) return existing;
	return undefined;
}

export const prisma =
	currentClient() ??
	new PrismaClient({
		log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
	});

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}
