"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import type { Level } from "@/lib/axes";
import { dificuldadeKeyFromLevel } from "@/lib/difficulty";
import { databaseMessage } from "@/lib/database";
import { prisma } from "@/lib/prisma";
import { alternativesFromForm, questionSchema, zodMessage } from "@/lib/validation";

function destination(key: number | null, error: string, simuladoKey?: number) {
  const errorQuery = `error=${encodeURIComponent(error)}`;
  if (simuladoKey) redirect(`/admin/simulados/${simuladoKey}?form=pergunta&${errorQuery}`);
  const form = key ? String(key) : "novo";
  redirect(`/admin/questoes?form=${form}&${errorQuery}`);
}

export async function saveQuestion(formData: FormData) {
  await requireAdmin();
  const key = Number(formData.get("questionKey"));
  const editing = Number.isInteger(key) && key > 0;
  const simuladoKey = Number(formData.get("simuladoKey"));
  const linkExam = Number.isInteger(simuladoKey) && simuladoKey > 0;
  const parsed = questionSchema.safeParse({
    code: formData.get("code"),
    axis: formData.get("axis"),
    level: formData.get("level"),
    statement: formData.get("statement"),
    alternatives: alternativesFromForm(formData),
  });
  if (!parsed.success) destination(editing ? key : null, zodMessage(parsed.error), linkExam ? simuladoKey : undefined);

  const values = parsed.success ? parsed.data : null;
  if (!values) return;

  try {
    const dificuldadeKey = await dificuldadeKeyFromLevel(values.level as Level);
    await prisma.$transaction(async (tx) => {
      const savedKey = editing
        ? key
        : ((await tx.dim_Questao_Eixo.aggregate({ _max: { QuestaoEixoKey: true } }))._max.QuestaoEixoKey ?? 0) + 1;
      const data = {
        CodigoQuestao: values.code,
        EixoTematico: values.axis,
        DificuldadeKey: dificuldadeKey,
        Enunciado: values.statement,
      };
      if (editing) {
        await tx.dim_Questao_Eixo.update({ where: { QuestaoEixoKey: key }, data });
      } else {
        await tx.dim_Questao_Eixo.create({ data: { QuestaoEixoKey: savedKey, ...data } });
      }
      await tx.alternativa.deleteMany({ where: { QuestaoEixoKey: savedKey } });
      await tx.alternativa.createMany({
        data: values.alternatives.map((item) => ({
          QuestaoEixoKey: savedKey,
          Letra: item.letter,
          Texto: item.text,
          Correta: item.correct ? 1 : 0,
        })),
      });
      if (linkExam) {
        await tx.simulado_Questao.upsert({
          where: { TempoKey_QuestaoEixoKey: { TempoKey: simuladoKey, QuestaoEixoKey: savedKey } },
          update: {},
          create: { TempoKey: simuladoKey, QuestaoEixoKey: savedKey },
        });
      }
    });
  } catch (error) {
    const message = databaseMessage(error, "save");
    if (message) destination(editing ? key : null, message, linkExam ? simuladoKey : undefined);
    throw error;
  }

  revalidatePath("/admin/questoes");
  revalidatePath("/admin/simulados");
  revalidatePath("/admin");
  if (linkExam) redirect(`/admin/simulados/${simuladoKey}?notice=saved`);
  redirect("/admin/questoes?notice=saved");
}

export async function deleteQuestion(formData: FormData) {
  await requireAdmin();
  const key = Number(formData.get("id"));
  try {
    await prisma.dim_Questao_Eixo.delete({ where: { QuestaoEixoKey: key } });
  } catch (error) {
    const message = databaseMessage(error, "delete");
    if (message) redirect(`/admin/questoes?error=${encodeURIComponent(message)}`);
    throw error;
  }
  revalidatePath("/admin/questoes");
  revalidatePath("/admin");
  redirect("/admin/questoes?notice=deleted");
}
