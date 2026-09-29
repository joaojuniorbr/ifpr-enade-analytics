import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function datasourceUrl(): string | undefined {
	const raw = process.env.DATABASE_URL;
	if (!raw) return undefined;
	if (/[?&]pool_timeout=/.test(raw)) return raw;
	return `${raw}${raw.includes('?') ? '&' : '?'}pool_timeout=30`;
}

function createClient(): PrismaClient {
	const url = datasourceUrl();
	return new PrismaClient({
		log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
		...(url ? { datasources: { db: { url } } } : {}),
	});
}

const cached = globalForPrisma.prisma;
const reusable =
	cached && 'tentativa' in cached && 'alternativa' in cached ? cached : undefined;

if (cached && cached !== reusable) {
	void cached.$disconnect();
}

export const prisma = reusable ?? createClient();

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}
