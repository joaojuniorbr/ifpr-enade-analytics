"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { databaseMessage } from "@/lib/database";
import { prisma } from "@/lib/prisma";
import { zodMessage, examSchema } from "@/lib/validation";

function destination(key: number | null, error: string) {
  const url = key ? `/admin/simulados/${key}` : "/admin/simulados";
  redirect(`${url}?error=${encodeURIComponent(error)}`);
}

export async function saveExam(formData: FormData) {
  await requireAdmin();
  const key = Number(formData.get("examKey"));
  const editing = Number.isInteger(key) && key > 0;
  const parsed = examSchema.safeParse({
    code: formData.get("code"),
    applicationNumber: formData.get("applicationNumber"),
    description: formData.get("description"),
  });
  if (!parsed.success) destination(editing ? key : null, zodMessage(parsed.error));
  if (!parsed.success) return;
  const values = parsed.data;

  try {
    if (editing) {
      await prisma.dim_Simulado.update({
        where: { SimuladoKey: key },
        data: {
          CodigoSimulado: values.code,
          NumeroAplicacao: values.applicationNumber,
          DescricaoSimulado: values.description,
        },
      });
    } else {
      const latest = await prisma.dim_Simulado.aggregate({ _max: { SimuladoKey: true } });
      await prisma.dim_Simulado.create({
        data: {
          SimuladoKey: (latest._max.SimuladoKey ?? 0) + 1,
          CodigoSimulado: values.code,
          NumeroAplicacao: values.applicationNumber,
          DescricaoSimulado: values.description,
        },
      });
    }
  } catch (error) {
    const message = databaseMessage(error, "save");
    if (message) destination(editing ? key : null, message);
    throw error;
  }

  revalidatePath("/admin/simulados");
  revalidatePath("/admin");
  redirect("/admin/simulados?notice=saved");
}

export async function deleteExam(formData: FormData) {
  await requireAdmin();
  const key = Number(formData.get("id"));
  try {
    await prisma.dim_Simulado.delete({ where: { SimuladoKey: key } });
  } catch (error) {
    const message = databaseMessage(error, "delete");
    if (message) redirect(`/admin/simulados?error=${encodeURIComponent(message)}`);
    throw error;
  }
  revalidatePath("/admin/simulados");
  revalidatePath("/admin");
  redirect("/admin/simulados?notice=deleted");
}
