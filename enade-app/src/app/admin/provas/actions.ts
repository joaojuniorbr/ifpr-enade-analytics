"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirAdmin } from "@/lib/auth";
import { dataUtc } from "@/lib/datas";
import { estadoInicial, type EstadoForm } from "@/lib/formularios";
import { prisma } from "@/lib/prisma";
import { mensagemZod, provaSchema } from "@/lib/validacao";

function lerProva(formData: FormData) {
  const ids = [...new Set(formData.getAll("perguntaId").map((valor) => String(valor)).filter(Boolean))];
  return {
    id: String(formData.get("id") ?? "").trim(),
    titulo: String(formData.get("titulo") ?? ""),
    data: String(formData.get("data") ?? ""),
    perguntaIds: ids,
  };
}

export async function salvarProva(
  estado: EstadoForm = estadoInicial,
  formData: FormData,
): Promise<EstadoForm> {
  void estado;
  await exigirAdmin();
  const bruto = lerProva(formData);
  const validado = provaSchema.safeParse(bruto);
  if (!validado.success) return { erro: mensagemZod(validado.error) };

  const dados = validado.data;
  const perguntas = await prisma.pergunta.findMany({
    where: dados.id
      ? {
          id: { in: dados.perguntaIds },
          OR: [{ ativa: true }, { provas: { some: { provaId: dados.id } } }],
        }
      : { id: { in: dados.perguntaIds }, ativa: true },
    select: { id: true },
  });

  if (dados.id) {
    const existente = await prisma.prova.findUnique({
      where: { id: dados.id },
      include: { _count: { select: { tentativas: true } } },
    });
    if (!existente) return { erro: "Prova não encontrada." };

    if (existente._count.tentativas > 0) {
      await prisma.prova.update({
        where: { id: dados.id },
        data: { titulo: dados.titulo },
      });
      revalidatePath("/admin/provas");
      redirect("/admin/provas?aviso=salva");
    }
  }

  if (perguntas.length !== dados.perguntaIds.length) {
    return { erro: "Selecione apenas perguntas ativas." };
  }

  if (!dados.id) {
    await prisma.prova.create({
      data: {
        titulo: dados.titulo,
        data: dataUtc(dados.data),
        perguntas: {
          create: dados.perguntaIds.map((perguntaId) => ({ perguntaId })),
        },
      },
    });
    revalidatePath("/admin/provas");
    redirect("/admin/provas?aviso=salva");
  }

  await prisma.$transaction(async (tx) => {
    await tx.prova.update({
      where: { id: dados.id },
      data: { titulo: dados.titulo, data: dataUtc(dados.data) },
    });
    await tx.provaPergunta.deleteMany({ where: { provaId: dados.id } });
    await tx.provaPergunta.createMany({
      data: dados.perguntaIds.map((perguntaId) => ({ provaId: dados.id, perguntaId })),
    });
  });

  revalidatePath("/admin/provas");
  revalidatePath(`/admin/provas/${dados.id}`);
  redirect("/admin/provas?aviso=salva");
}

export async function excluirProva(formData: FormData) {
  await exigirAdmin();
  const id = String(formData.get("id") ?? "");
  const tentativas = await prisma.tentativa.count({ where: { provaId: id } });
  if (tentativas > 0) {
    redirect("/admin/provas?erro=em-uso");
  }
  await prisma.prova.delete({ where: { id } });
  revalidatePath("/admin/provas");
  redirect("/admin/provas?aviso=excluida");
}
