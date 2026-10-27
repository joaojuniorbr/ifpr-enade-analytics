import type { Level } from "@/lib/axes";
import { prisma } from "@/lib/prisma";

const FALLBACK: Record<Level, number> = {
  Fácil: 1,
  Médio: 2,
  Difícil: 3,
};

export async function dificuldadeKeyFromLevel(level: Level): Promise<number> {
  const row = await prisma.dim_Dificuldade.findUnique({ where: { Nivel: level } });
  return row?.DificuldadeKey ?? FALLBACK[level];
}

export async function ensureDificuldadeSeed(): Promise<void> {
  for (const [nivel, key] of Object.entries(FALLBACK) as [Level, number][]) {
    await prisma.dim_Dificuldade.upsert({
      where: { DificuldadeKey: key },
      update: { Nivel: nivel },
      create: { DificuldadeKey: key, Nivel: nivel },
    });
  }
}
