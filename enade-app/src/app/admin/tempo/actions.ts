"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { databaseMessage } from "@/lib/database";
import { utcDate } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { zodMessage, timeSchema } from "@/lib/validation";

function destination(key: number | null, error: string) {
  const url = key ? `/admin/tempo/${key}` : "/admin/tempo";
  redirect(`${url}?error=${encodeURIComponent(error)}`);
}

export async function saveTime(formData: FormData) {
  await requireAdmin();
  const key = Number(formData.get("timeKey"));
  const editing = Number.isInteger(key) && key > 0;
  const parsed = timeSchema.safeParse({
    data: formData.get("data"),
    year: formData.get("year"),
    month: formData.get("month"),
    monthName: formData.get("monthName"),
    semesterWeek: formData.get("semesterWeek"),
  });
  if (!parsed.success) destination(editing ? key : null, zodMessage(parsed.error));
  if (!parsed.success) return;
  const values = parsed.data;

  try {
    const fields = {
      Data: utcDate(values.data),
      Ano: values.year,
      Mes: values.month,
      NomeMes: values.monthName,
      SemanaSemestre: values.semesterWeek,
    };
    if (editing) {
      await prisma.dim_Tempo.update({ where: { TempoKey: key }, data: fields });
    } else {
      const latest = await prisma.dim_Tempo.aggregate({ _max: { TempoKey: true } });
      await prisma.dim_Tempo.create({
        data: { TempoKey: (latest._max.TempoKey ?? 0) + 1, ...fields },
      });
    }
  } catch (error) {
    const message = databaseMessage(error, "save");
    if (message) destination(editing ? key : null, message);
    throw error;
  }

  revalidatePath("/admin/tempo");
  redirect("/admin/tempo?notice=saved");
}

export async function deleteTime(formData: FormData) {
  await requireAdmin();
  const key = Number(formData.get("id"));
  try {
    await prisma.dim_Tempo.delete({ where: { TempoKey: key } });
  } catch (error) {
    const message = databaseMessage(error, "delete");
    if (message) redirect(`/admin/tempo?error=${encodeURIComponent(message)}`);
    throw error;
  }
  revalidatePath("/admin/tempo");
  redirect("/admin/tempo?notice=deleted");
}
