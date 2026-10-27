import { createHash } from "node:crypto";
import type { SessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureTurmaKey } from "@/lib/turma";

export function anonymousCode(subject: string): string {
  const hash = createHash("sha256").update(subject).digest("hex").slice(0, 20);
  return `ALU${hash}`;
}

export async function findStudent(user: SessionUser) {
  return prisma.dim_Aluno_Anonimo.findUnique({
    where: { CodigoAlunoAnonimo: anonymousCode(user.id) },
    include: { Dim_Turma: true },
  });
}

export async function createStudent(user: SessionUser, classGroup: string) {
  const code = anonymousCode(user.id);
  const existing = await prisma.dim_Aluno_Anonimo.findUnique({
    where: { CodigoAlunoAnonimo: code },
    include: { Dim_Turma: true },
  });
  if (existing) return existing;

  const turmaKey = await ensureTurmaKey(classGroup);
  const latest = await prisma.dim_Aluno_Anonimo.aggregate({ _max: { AlunoKey: true } });
  return prisma.dim_Aluno_Anonimo.create({
    data: {
      AlunoKey: (latest._max.AlunoKey ?? 0) + 1,
      CodigoAlunoAnonimo: code,
      TurmaKey: turmaKey,
    },
    include: { Dim_Turma: true },
  });
}
