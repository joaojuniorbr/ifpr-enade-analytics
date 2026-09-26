"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { databaseMessage } from "@/lib/database";
import { prisma } from "@/lib/prisma";
import { zodMessage, questionSchema } from "@/lib/validation";

function destination(key: number | null, error: string) {
  const url = key ? `/admin/questoes/${key}` : "/admin/questoes";
  redirect(`${url}?error=${encodeURIComponent(error)}`);
}

export async function saveQuestion(formData: FormData) {
  await requireAdmin();
  const key = Number(formData.get("questionKey"));
  const editing = Number.isInteger(key) && key > 0;
  const parsed = questionSchema.safeParse({
    code: formData.get("code"),
    axis: formData.get("axis"),
    level: formData.get("level"),
  });
  if (!parsed.success) destination(editing ? key : null, zodMessage(parsed.error));

  const values = parsed.success ? parsed.data : null;
  if (!values) return;

  try {
    if (editing) {
      await prisma.dim_Questao.update({
        where: { QuestaoKey: key },
        data: {
          CodigoQuestao: values.code,
          EixoTematico: values.axis,
          NivelDificuldade: values.level,
        },
      });
    } else {
      const latest = await prisma.dim_Questao.aggregate({ _max: { QuestaoKey: true } });
      await prisma.dim_Questao.create({
        data: {
          QuestaoKey: (latest._max.QuestaoKey ?? 0) + 1,
          CodigoQuestao: values.code,
          EixoTematico: values.axis,
          NivelDificuldade: values.level,
        },
      });
    }
  } catch (error) {
    const message = databaseMessage(error, "save");
    if (message) destination(editing ? key : null, message);
    throw error;
  }

  revalidatePath("/admin/questoes");
  revalidatePath("/admin");
  redirect("/admin/questoes?notice=saved");
}

export async function deleteQuestion(formData: FormData) {
  await requireAdmin();
  const key = Number(formData.get("id"));
  try {
    await prisma.dim_Questao.delete({ where: { QuestaoKey: key } });
  } catch (error) {
    const message = databaseMessage(error, "delete");
    if (message) redirect(`/admin/questoes?error=${encodeURIComponent(message)}`);
    throw error;
  }
  revalidatePath("/admin/questoes");
  revalidatePath("/admin");
  redirect("/admin/questoes?notice=deleted");
}
