import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { discardAttempt, submitAttempt } from "@/app/simulados/actions";
import { DeleteButton } from "@/components/delete-button";
import { ExamForm } from "@/components/exam-form";
import { Notice } from "@/components/notice";
import { requireStudent } from "@/lib/auth";
import { formatRate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { findStudent } from "@/lib/student";
import { cardClass, secondaryButton } from "@/lib/styles";

export const metadata = { title: "Tentativa" };

export default async function AttemptPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string; id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireStudent();
  const student = await findStudent(user);
  if (!student) notFound();

  const { key: keyParam, id: idParam } = await params;
  const examKey = Number(keyParam);
  const attemptKey = Number(idParam);
  if (!Number.isInteger(examKey) || !Number.isInteger(attemptKey)) notFound();

  const attempt = await prisma.tentativa.findUnique({
    where: { TentativaKey: attemptKey },
    include: {
      Dim_Simulado: true,
      Itens: true,
    },
  });
  if (!attempt || attempt.SimuladoKey !== examKey || attempt.AlunoKey !== student.AlunoKey) notFound();

  const order = attempt.OrdemQuestoes.split(",")
    .map(Number)
    .filter((key) => Number.isInteger(key) && key > 0);
  const questions = await prisma.dim_Questao.findMany({
    where: { QuestaoKey: { in: order } },
    include: { Alternativas: { orderBy: { Letra: "asc" } } },
  });
  const byKey = new Map(questions.map((question) => [question.QuestaoKey, question]));
  const query = await searchParams;
  const finished = Boolean(attempt.FinalizadaEm);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[#245c38]">{attempt.Dim_Simulado.DescricaoSimulado}</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">
            {finished ? "Resultado da tentativa" : "Simulado em andamento"}
          </h1>
        </div>
        <Image src="/undraw-multiple-choice.svg" alt="" width={180} height={140} unoptimized className="h-auto w-28" />
      </div>

      {query.error ? <Notice tone="red" text={query.error} /> : null}

      {finished ? (
        <div className="space-y-4">
          <section className={cardClass}>
            <div>
              <p className="text-sm text-slate-500">Você acertou</p>
              <p className="mt-1 text-4xl font-semibold text-[#1e5c34]">
                {attempt.Acertos}/{attempt.TotalQuestoes}
              </p>
              <p className="mt-2 text-sm text-slate-600">{formatRate(attempt.Acertos, attempt.TotalQuestoes)}</p>
            </div>
          </section>
          {order.map((questionKey, index) => {
            const question = byKey.get(questionKey);
            const item = attempt.Itens.find((answer) => answer.QuestaoKey === questionKey);
            if (!question || !item) return null;
            const correct = question.Alternativas.find((alternative) => alternative.Correta === 1);
            return (
              <article key={questionKey} className={cardClass}>
                <p className="text-sm font-medium text-[#245c38]">Pergunta {index + 1}</p>
                <p className="mt-2 whitespace-pre-wrap text-slate-900">{question.Enunciado}</p>
                <p className="mt-3 text-sm text-slate-700">
                  Sua resposta: <span className="font-medium">{item.LetraMarcada}</span>
                  {" · "}
                  {item.Acertou === 1 ? "acertou" : `a correta é ${correct?.Letra ?? "—"}`}
                </p>
              </article>
            );
          })}
          <div className="flex flex-wrap gap-3">
            <Link href={`/simulados/${examKey}`} className={secondaryButton}>
              Voltar ao simulado
            </Link>
            <Link href="/evolucao" className={secondaryButton}>
              Ver evolução
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <ExamForm
            action={submitAttempt}
            attemptKey={attempt.TentativaKey}
            questions={order.flatMap((questionKey) => {
              const question = byKey.get(questionKey);
              if (!question?.Enunciado) return [];
              return [
                {
                  id: question.QuestaoKey,
                  axis: question.EixoTematico,
                  statement: question.Enunciado,
                  options: question.Alternativas.map((alternative) => ({
                    letter: alternative.Letra,
                    text: alternative.Texto,
                  })),
                },
              ];
            })}
          />
          <DeleteButton
            id={String(attempt.TentativaKey)}
            action={discardAttempt}
            label="Descartar tentativa"
            message="Descartar esta tentativa e perder as respostas ainda não enviadas?"
          />
        </div>
      )}
    </div>
  );
}
