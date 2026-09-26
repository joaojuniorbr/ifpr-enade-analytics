"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { databaseMessage } from "@/lib/database";
import { prisma } from "@/lib/prisma";
import { studentSchema, zodMessage } from "@/lib/validation";

function destination(key: number | null, error: string) {
  const url = key ? `/admin/alunos/${key}` : "/admin/alunos";
  redirect(`${url}?error=${encodeURIComponent(error)}`);
}

export async function saveStudent(formData: FormData) {
  await requireAdmin();
  const key = Number(formData.get("studentKey"));
  const editing = Number.isInteger(key) && key > 0;
  const parsed = studentSchema.safeParse({
    code: formData.get("code"),
    classGroup: formData.get("classGroup"),
  });
  if (!parsed.success) destination(editing ? key : null, zodMessage(parsed.error));
  if (!parsed.success) return;
  const values = parsed.data;

  try {
    if (editing) {
      await prisma.dim_Aluno_Anonimo.update({
        where: { AlunoKey: key },
        data: { CodigoAlunoAnonimo: values.code, TurmaGrupo: values.classGroup },
      });
    } else {
      const latest = await prisma.dim_Aluno_Anonimo.aggregate({ _max: { AlunoKey: true } });
      await prisma.dim_Aluno_Anonimo.create({
        data: {
          AlunoKey: (latest._max.AlunoKey ?? 0) + 1,
          CodigoAlunoAnonimo: values.code,
          TurmaGrupo: values.classGroup,
        },
      });
    }
  } catch (error) {
    const message = databaseMessage(error, "save");
    if (message) destination(editing ? key : null, message);
    throw error;
  }

  revalidatePath("/admin/alunos");
  revalidatePath("/admin");
  redirect("/admin/alunos?notice=saved");
}

export async function deleteStudent(formData: FormData) {
  await requireAdmin();
  const key = Number(formData.get("id"));
  try {
    await prisma.dim_Aluno_Anonimo.delete({ where: { AlunoKey: key } });
  } catch (error) {
    const message = databaseMessage(error, "delete");
    if (message) redirect(`/admin/alunos?error=${encodeURIComponent(message)}`);
    throw error;
  }
  revalidatePath("/admin/alunos");
  revalidatePath("/admin");
  redirect("/admin/alunos?notice=deleted");
}
