"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStudent } from "@/lib/auth";
import { databaseMessage } from "@/lib/database";
import { isReadyQuestion, shuffle } from "@/lib/questions";
import { prisma } from "@/lib/prisma";
import { findStudent } from "@/lib/student";

function examPath(examKey: number, error: string) {
  redirect(`/simulados/${examKey}?error=${encodeURIComponent(error)}`);
}

export async function startAttempt(formData: FormData) {
  const user = await requireStudent();
  const student = await findStudent(user);
  const examKey = Number(formData.get("examKey"));
  if (!student || !Number.isInteger(examKey)) redirect("/");

  const open = await prisma.tentativa.findFirst({
    where: { AlunoKey: student.AlunoKey, SimuladoKey: examKey, FinalizadaEm: null },
  });
  if (open) redirect(`/simulados/${examKey}/tentativa/${open.TentativaKey}`);

  const links = await prisma.simulado_Questao.findMany({
    where: { SimuladoKey: examKey },
    include: { Dim_Questao: { include: { Alternativas: true } } },
  });
  const ready = links.map((link) => link.Dim_Questao).filter(isReadyQuestion);
  if (ready.length === 0) examPath(examKey, "Este simulado ainda não tem perguntas prontas.");

  const order = shuffle(ready.map((question) => question.QuestaoKey));
  const attempt = await prisma.tentativa.create({
    data: {
      AlunoKey: student.AlunoKey,
      SimuladoKey: examKey,
      TotalQuestoes: order.length,
      OrdemQuestoes: order.join(","),
    },
  });

  revalidatePath("/");
  revalidatePath(`/simulados/${examKey}`);
  redirect(`/simulados/${examKey}/tentativa/${attempt.TentativaKey}`);
}

export async function submitAttempt(formData: FormData) {
  const user = await requireStudent();
  const student = await findStudent(user);
  const attemptKey = Number(formData.get("attemptKey"));
  if (!student || !Number.isInteger(attemptKey)) redirect("/");

  const attempt = await prisma.tentativa.findUnique({ where: { TentativaKey: attemptKey } });
  if (!attempt || attempt.AlunoKey !== student.AlunoKey) redirect("/");
  if (attempt.FinalizadaEm) redirect(`/simulados/${attempt.SimuladoKey}/tentativa/${attempt.TentativaKey}`);

  const order = attempt.OrdemQuestoes.split(",").map(Number).filter((key) => Number.isInteger(key) && key > 0);
  const questions = await prisma.dim_Questao.findMany({
    where: { QuestaoKey: { in: order } },
    include: { Alternativas: true },
  });
  const byKey = new Map(questions.map((question) => [question.QuestaoKey, question]));
  const back = `/simulados/${attempt.SimuladoKey}/tentativa/${attempt.TentativaKey}`;

  const items = [];
  for (const questionKey of order) {
    const question = byKey.get(questionKey);
    if (!question) {
      redirect(`${back}?error=${encodeURIComponent("Uma pergunta desta tentativa não está mais disponível.")}`);
    }
    const marked = String(formData.get(`q-${questionKey}`) ?? "").trim().toUpperCase();
    const options = question.Alternativas.map((item) => item.Letra);
    if (!options.includes(marked)) {
      redirect(`${back}?error=${encodeURIComponent("Responda todas as perguntas antes de enviar.")}`);
    }
    const correct = question.Alternativas.find((item) => item.Correta === 1)?.Letra;
    items.push({
      TentativaKey: attempt.TentativaKey,
      QuestaoKey: questionKey,
      LetraMarcada: marked,
      Acertou: marked === correct ? 1 : 0,
    });
  }

  const hits = items.filter((item) => item.Acertou === 1).length;
  try {
    await prisma.$transaction([
      prisma.tentativa_Item.createMany({ data: items }),
      prisma.tentativa.update({
        where: { TentativaKey: attempt.TentativaKey },
        data: { Acertos: hits, TotalQuestoes: items.length, FinalizadaEm: new Date() },
      }),
    ]);
  } catch (error) {
    const message = databaseMessage(error, "save");
    if (message) redirect(`${back}?error=${encodeURIComponent(message)}`);
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/evolucao");
  revalidatePath(`/admin/simulados/${attempt.SimuladoKey}`);
  redirect(back);
}

export async function discardAttempt(formData: FormData) {
  const user = await requireStudent();
  const student = await findStudent(user);
  const attemptKey = Number(formData.get("id"));
  if (!student || !Number.isInteger(attemptKey)) redirect("/");

  const attempt = await prisma.tentativa.findUnique({ where: { TentativaKey: attemptKey } });
  if (!attempt || attempt.AlunoKey !== student.AlunoKey || attempt.FinalizadaEm) redirect("/");

  await prisma.tentativa.delete({ where: { TentativaKey: attemptKey } });
  revalidatePath("/");
  revalidatePath(`/simulados/${attempt.SimuladoKey}`);
  redirect(`/simulados/${attempt.SimuladoKey}`);
}
