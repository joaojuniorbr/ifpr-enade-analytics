"use server";

import type { NivelDificuldade } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirAdmin } from "@/lib/auth";
import { estadoInicial, type EstadoForm } from "@/lib/formularios";
import { prisma } from "@/lib/prisma";
import { mensagemZod, perguntaSchema } from "@/lib/validacao";

function lerPergunta(formData: FormData) {
  const textos = formData.getAll("texto").map((valor) => String(valor));
  const ids = formData.getAll("alternativaId").map((valor) => String(valor));
  const correta = Number(formData.get("correta"));
  return {
    id: String(formData.get("id") ?? "").trim(),
    enunciado: String(formData.get("enunciado") ?? ""),
    eixo: String(formData.get("eixo") ?? ""),
    tema: String(formData.get("tema") ?? ""),
    nivel: String(formData.get("nivel") ?? ""),
    ativa: formData.getAll("ativa").includes("true"),
    correta: Number.isInteger(correta) ? correta : -1,
    alternativas: textos.map((texto, indice) => ({
      id: ids[indice] ? ids[indice] : undefined,
      texto,
    })),
  };
}

function nivelOuNulo(nivel: string): NivelDificuldade | null {
  if (nivel === "FACIL" || nivel === "MEDIO" || nivel === "DIFICIL") return nivel;
  return null;
}

export async function salvarPergunta(
  estado: EstadoForm = estadoInicial,
  formData: FormData,
): Promise<EstadoForm> {
  void estado;
  await exigirAdmin();
  const bruto = lerPergunta(formData);
  const validado = perguntaSchema.safeParse(bruto);
  if (!validado.success) return { erro: mensagemZod(validado.error) };

  const dados = validado.data;
  const eixo = dados.eixo || null;
  const tema = dados.tema || null;
  const nivel = nivelOuNulo(dados.nivel);

  if (!dados.id) {
    await prisma.pergunta.create({
      data: {
        enunciado: dados.enunciado,
        eixo,
        tema,
        nivel,
        ativa: dados.ativa,
        alternativas: {
          create: dados.alternativas.map((alternativa, indice) => ({
            texto: alternativa.texto,
            correta: indice === dados.correta,
            ordem: indice,
          })),
        },
      },
    });
    revalidatePath("/admin/perguntas");
    redirect("/admin/perguntas?aviso=salva");
  }

  const existente = await prisma.pergunta.findUnique({
    where: { id: dados.id },
    include: { alternativas: true, _count: { select: { ordens: true } } },
  });
  if (!existente) return { erro: "Pergunta não encontrada." };

  const usada = existente._count.ordens > 0;
  if (usada) {
    const idsAtuais = new Set(existente.alternativas.map((alternativa) => alternativa.id));
    const idsEnviados = dados.alternativas.map((alternativa) => alternativa.id).filter(Boolean);
    const mesmos =
      idsEnviados.length === existente.alternativas.length &&
      idsEnviados.every((id) => id && idsAtuais.has(id));
    if (!mesmos) {
      return {
        erro: "Esta pergunta já entrou em uma tentativa. Dá para editar o texto, mas não incluir ou remover alternativas.",
      };
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.pergunta.update({
      where: { id: dados.id },
      data: { enunciado: dados.enunciado, eixo, tema, nivel, ativa: dados.ativa },
    });

    if (usada) {
      for (const [indice, alternativa] of dados.alternativas.entries()) {
        if (!alternativa.id) continue;
        await tx.alternativa.update({
          where: { id: alternativa.id },
          data: {
            texto: alternativa.texto,
            correta: indice === dados.correta,
            ordem: indice,
          },
        });
      }
      return;
    }

    await tx.alternativa.deleteMany({ where: { perguntaId: dados.id } });
    await tx.alternativa.createMany({
      data: dados.alternativas.map((alternativa, indice) => ({
        perguntaId: dados.id,
        texto: alternativa.texto,
        correta: indice === dados.correta,
        ordem: indice,
      })),
    });
  });

  revalidatePath("/admin/perguntas");
  revalidatePath(`/admin/perguntas/${dados.id}`);
  redirect("/admin/perguntas?aviso=salva");
}

export async function excluirPergunta(formData: FormData) {
  await exigirAdmin();
  const id = String(formData.get("id") ?? "");
  const usada = await prisma.ordemPergunta.count({ where: { perguntaId: id } });
  if (usada > 0) {
    await prisma.pergunta.update({ where: { id }, data: { ativa: false } });
    revalidatePath("/admin/perguntas");
    redirect("/admin/perguntas?aviso=desativada");
  }

  await prisma.$transaction([
    prisma.provaPergunta.deleteMany({ where: { perguntaId: id } }),
    prisma.pergunta.delete({ where: { id } }),
  ]);
  revalidatePath("/admin/perguntas");
  redirect("/admin/perguntas?aviso=excluida");
}
