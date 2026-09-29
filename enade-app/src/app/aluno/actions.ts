"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStudent } from "@/lib/auth";
import { createStudent } from "@/lib/student";
import { zodMessage } from "@/lib/validation";
import { z } from "zod";

const classGroupSchema = z.object({
  classGroup: z.string().trim().min(1, "Informe a turma.").max(64, "A turma pode ter no máximo 64 caracteres."),
});

export async function saveClassGroup(formData: FormData) {
  const user = await requireStudent();
  const parsed = classGroupSchema.safeParse({ classGroup: formData.get("classGroup") });
  if (!parsed.success) {
    redirect(`/primeiro-acesso?error=${encodeURIComponent(zodMessage(parsed.error))}`);
  }

  await createStudent(user, parsed.data.classGroup);
  revalidatePath("/");
  redirect("/");
}
