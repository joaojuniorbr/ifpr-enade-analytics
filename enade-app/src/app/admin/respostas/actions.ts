"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { databaseMessage } from "@/lib/database";
import { prisma } from "@/lib/prisma";
import { zodMessage, answerSchema } from "@/lib/validation";

function destination(key: number | null, error: string) {
  const url = key ? `/admin/respostas/${key}` : "/admin/respostas";
  redirect(`${url}?error=${encodeURIComponent(error)}`);
}

export async function saveAnswer(formData: FormData) {
  await requireAdmin();
  const key = Number(formData.get("answerKey"));
  const editing = Number.isInteger(key) && key > 0;
  const parsed = answerSchema.safeParse({
    timeKey: formData.get("timeKey"),
    studentKey: formData.get("studentKey"),
    questionKey: formData.get("questionKey"),
    examKey: formData.get("examKey"),
    answer: formData.get("answer"),
    wasCorrect: formData.get("wasCorrect"),
    seconds: formData.get("seconds"),
  });
  if (!parsed.success) destination(editing ? key : null, zodMessage(parsed.error));
  if (!parsed.success) return;
  const values = parsed.data;
  const seconds = values.seconds === "" ? null : Number(values.seconds);
  const fields = {
    TempoKey: values.timeKey,
    AlunoKey: values.studentKey,
    QuestaoKey: values.questionKey,
    SimuladoKey: values.examKey,
    RespostaDada: values.answer,
    Acertou: Number(values.wasCorrect),
    TempoRespostaSegundos: seconds,
  };

  try {
    if (editing) {
      await prisma.fato_Respostas.update({ where: { RespostaKey: key }, data: fields });
    } else {
      const latest = await prisma.fato_Respostas.aggregate({ _max: { RespostaKey: true } });
      await prisma.fato_Respostas.create({
        data: { RespostaKey: (latest._max.RespostaKey ?? 0) + 1, ...fields },
      });
    }
  } catch (error) {
    const message = databaseMessage(error, "save");
    if (message) destination(editing ? key : null, message);
    throw error;
  }

  revalidatePath("/admin/respostas");
  revalidatePath("/admin");
  redirect("/admin/respostas?notice=saved");
}

export async function deleteAnswer(formData: FormData) {
  await requireAdmin();
  const key = Number(formData.get("id"));
  try {
    await prisma.fato_Respostas.delete({ where: { RespostaKey: key } });
  } catch (error) {
    const message = databaseMessage(error, "delete");
    if (message) redirect(`/admin/respostas?error=${encodeURIComponent(message)}`);
    throw error;
  }
  revalidatePath("/admin/respostas");
  revalidatePath("/admin");
  redirect("/admin/respostas?notice=deleted");
}
