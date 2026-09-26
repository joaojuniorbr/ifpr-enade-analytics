"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirUsuario } from "@/lib/auth";
import { situacaoProva } from "@/lib/datas";
import { embaralhar } from "@/lib/embaralhar";
import { prisma } from "@/lib/prisma";

async function carregarTentativaDoUsuario(tentativaId: string, usuarioId: string) {
  return prisma.tentativa.findFirst({
    where: { id: tentativaId, usuarioId },
    include: {
      prova: true,
      ordem: { select: { perguntaId: true } },
    },
  });
}

export async function iniciarTentativa(formData: FormData) {
  const usuario = await exigirUsuario();
  const provaId = String(formData.get("provaId") ?? "");
  const prova = await prisma.prova.findUnique({
    where: { id: provaId },
    include: {
      perguntas: {
        where: { pergunta: { ativa: true } },
        select: { perguntaId: true },
      },
    },
  });
  if (!prova) redirect("/prova");
  if (situacaoProva(prova.data) !== "liberada") redirect(`/prova/${provaId}`);

  const existente = await prisma.tentativa.findUnique({
    where: { usuarioId_provaId: { usuarioId: usuario.id, provaId } },
  });
  if (existente) redirect(`/prova/${provaId}`);

  const ids = embaralhar(prova.perguntas.map((item) => item.perguntaId));
  if (ids.length === 0) redirect(`/prova/${provaId}?erro=sem-perguntas`);

  try {
    await prisma.tentativa.create({
      data: {
        usuarioId: usuario.id,
        provaId,
        ordem: {
          create: ids.map((perguntaId, posicao) => ({ perguntaId, posicao })),
        },
      },
    });
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
      throw error;
    }
  }

  redirect(`/prova/${provaId}`);
}

export async function salvarResposta(entrada: {
  tentativaId: string;
  perguntaId: string;
  alternativaId: string;
}): Promise<{ ok: true } | { ok: false; erro: string }> {
  const usuario = await exigirUsuario();
  const tentativa = await carregarTentativaDoUsuario(entrada.tentativaId, usuario.id);
  if (!tentativa) return { ok: false, erro: "Tentativa não encontrada." };
  if (tentativa.concluidaEm) return { ok: false, erro: "Esta prova já foi concluída." };
  if (situacaoProva(tentativa.prova.data) !== "liberada") {
    return { ok: false, erro: "Esta prova não está liberada hoje." };
  }
  if (!tentativa.ordem.some((item) => item.perguntaId === entrada.perguntaId)) {
    return { ok: false, erro: "Esta questão não faz parte da sua tentativa." };
  }

  const alternativa = await prisma.alternativa.findFirst({
    where: { id: entrada.alternativaId, perguntaId: entrada.perguntaId },
  });
  if (!alternativa) return { ok: false, erro: "Alternativa inválida." };

  await prisma.resposta.upsert({
    where: {
      tentativaId_perguntaId: {
        tentativaId: tentativa.id,
        perguntaId: entrada.perguntaId,
      },
    },
    create: {
      tentativaId: tentativa.id,
      perguntaId: entrada.perguntaId,
      alternativaId: alternativa.id,
      acertou: alternativa.correta,
    },
    update: {
      alternativaId: alternativa.id,
      acertou: alternativa.correta,
    },
  });

  revalidatePath(`/prova/${tentativa.provaId}`);
  return { ok: true };
}

export async function concluirTentativa(
  tentativaId: string,
): Promise<{ ok: false; erro: string }> {
  const usuario = await exigirUsuario();
  const tentativa = await carregarTentativaDoUsuario(tentativaId, usuario.id);
  if (!tentativa) return { ok: false, erro: "Tentativa não encontrada." };
  if (tentativa.concluidaEm) redirect(`/prova/${tentativa.provaId}`);
  if (situacaoProva(tentativa.prova.data) !== "liberada") {
    return { ok: false, erro: "O prazo desta prova encerrou." };
  }

  const total = tentativa.ordem.length;
  const acertos = await prisma.resposta.count({
    where: { tentativaId: tentativa.id, acertou: true },
  });
  const nota = total === 0 ? 0 : Math.round((acertos / total) * 10000) / 100;

  await prisma.tentativa.updateMany({
    where: { id: tentativa.id, concluidaEm: null },
    data: { concluidaEm: new Date(), nota },
  });

  revalidatePath(`/prova/${tentativa.provaId}`);
  revalidatePath("/prova/desempenho");
  revalidatePath("/admin");
  redirect(`/prova/${tentativa.provaId}`);
}
