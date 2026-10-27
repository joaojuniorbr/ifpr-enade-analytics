import { prisma } from "@/lib/prisma";

export async function listTurmas() {
  return prisma.dim_Turma.findMany({
    orderBy: { TurmaGrupo: "asc" },
    select: { TurmaKey: true, TurmaGrupo: true },
  });
}

export async function ensureTurmaKey(turmaGrupo: string): Promise<number> {
  const trimmed = turmaGrupo.trim();
  const existing = await prisma.dim_Turma.findUnique({
    where: { TurmaGrupo: trimmed },
  });
  if (existing) return existing.TurmaKey;

  const latest = await prisma.dim_Turma.aggregate({ _max: { TurmaKey: true } });
  const created = await prisma.dim_Turma.create({
    data: {
      TurmaKey: (latest._max.TurmaKey ?? 0) + 1,
      TurmaGrupo: trimmed,
    },
  });
  return created.TurmaKey;
}
