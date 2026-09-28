import Link from "next/link";
import { notFound } from "next/navigation";
import { saveQuestion } from "@/app/admin/questoes/actions";
import { attachQuestion, detachQuestion } from "@/app/admin/simulados/actions";
import { Messages } from "@/components/admin-table";
import { DeleteButton } from "@/components/delete-button";
import { FormDrawer } from "@/components/form-drawer";
import { ExamFields } from "@/components/forms/exam-fields";
import { QuestionFields } from "@/components/question-fields";
import { correctLetter, isReadyQuestion } from "@/lib/questions";
import { formatDateTime } from "@/lib/dates";
import { formatRate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { withForm } from "@/lib/forms";
import { cardClass, fieldClass, primaryButton, secondaryButton } from "@/lib/styles";

export const metadata = { title: "Editar simulado" };

export default async function EditExamPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ error?: string; notice?: string; form?: string }>;
}) {
  const { key: keyParam } = await params;
  const key = Number(keyParam);
  if (!Number.isInteger(key)) notFound();
  const exam = await prisma.dim_Simulado.findUnique({
    where: { SimuladoKey: key },
    include: {
      Simulado_Questoes: {
        include: { Dim_Questao: { include: { Alternativas: { orderBy: { Letra: "asc" } } } } },
        orderBy: { QuestaoKey: "asc" },
      },
      Tentativas: {
        where: { FinalizadaEm: { not: null } },
        include: { Dim_Aluno_Anonimo: true },
        orderBy: { FinalizadaEm: "desc" },
        take: 20,
      },
    },
  });
  if (!exam) notFound();
  const query = await searchParams;
  const linked = new Set(exam.Simulado_Questoes.map((item) => item.QuestaoKey));
  const available = (
    await prisma.dim_Questao.findMany({
      where: { QuestaoKey: { notIn: [...linked] } },
      include: { Alternativas: true },
      orderBy: { CodigoQuestao: "asc" },
    })
  ).filter(isReadyQuestion);
  const readyCount = exam.Simulado_Questoes.filter((item) => isReadyQuestion(item.Dim_Questao)).length;
  const base = `/admin/simulados/${exam.SimuladoKey}`;
  const form = query.form;
  const drawerOpen = form === "dados" || form === "pergunta" || form === "vincular";

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{exam.DescricaoSimulado}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {readyCount} {readyCount === 1 ? "pergunta pronta" : "perguntas prontas"}. Na prova do aluno, a ordem é
            sorteada a cada tentativa.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={withForm(base, query, "dados")} className={secondaryButton}>
            Editar dados
          </Link>
          <Link href={withForm(base, query, "pergunta")} className={primaryButton}>
            Nova pergunta
          </Link>
          {available.length > 0 ? (
            <Link href={withForm(base, query, "vincular")} className={secondaryButton}>
              Incluir pronta
            </Link>
          ) : null}
        </div>
      </div>
      <Messages notice={query.notice} error={drawerOpen ? undefined : query.error} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Perguntas deste simulado</h2>
        {exam.Simulado_Questoes.length === 0 ? (
          <p className="text-sm text-slate-600">Nenhuma pergunta ligada ainda.</p>
        ) : (
          exam.Simulado_Questoes.map((item) => {
            const question = item.Dim_Questao;
            const ready = isReadyQuestion(question);
            return (
              <article key={question.QuestaoKey} className={cardClass}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#6d4aff]">
                      {question.CodigoQuestao} · {question.EixoTematico}
                    </p>
                    <h3 className="mt-1 font-medium text-slate-900">
                      {question.Enunciado?.trim() || "Sem enunciado"}
                    </h3>
                  </div>
                  <DeleteButton
                    id={`${exam.SimuladoKey}:${question.QuestaoKey}`}
                    action={detachQuestion}
                    label="Tirar"
                    message="Tirar esta pergunta do simulado?"
                  />
                </div>
                {question.Alternativas.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500">Sem respostas.</p>
                ) : (
                  <ul className="mt-3 space-y-1 text-sm text-slate-700">
                    {question.Alternativas.map((alternative) => (
                      <li key={alternative.AlternativaKey}>
                        <span className="font-medium">{alternative.Letra}.</span> {alternative.Texto}
                        {alternative.Correta === 1 ? <span className="ml-2 text-[#6d4aff]">correta</span> : null}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-3 text-sm text-slate-500">
                  {ready ? `Pronta · correta ${correctLetter(question.Alternativas)}` : "Incompleta"}
                  {" · "}
                  <Link href={`/admin/questoes?form=${question.QuestaoKey}`} className="font-medium text-[#6d4aff]">
                    Editar pergunta
                  </Link>
                </p>
              </article>
            );
          })
        )}
      </section>

      <FormDrawer open={form === "dados"} title="Editar simulado" closeHref={withForm(base, query)}>
        <Messages error={query.error} />
        <div className="mt-4">
          <ExamFields exam={exam} />
        </div>
      </FormDrawer>
      <FormDrawer open={form === "pergunta"} title="Nova pergunta neste simulado" closeHref={withForm(base, query)} width={640}>
        <Messages error={query.error} />
        <form action={saveQuestion} className="mt-4 space-y-3">
          <QuestionFields simuladoKey={exam.SimuladoKey} />
        </form>
      </FormDrawer>
      <FormDrawer open={form === "vincular"} title="Incluir pergunta pronta" closeHref={withForm(base, query)}>
        <Messages error={query.error} />
        <form action={attachQuestion} className="mt-4 space-y-3">
          <input type="hidden" name="examKey" value={exam.SimuladoKey} />
          <label className="block text-sm text-slate-700">
            Pergunta
            <select name="questionKey" required className={`${fieldClass} mt-1`} defaultValue="">
              <option value="" disabled>
                Escolha
              </option>
              {available.map((question) => (
                <option key={question.QuestaoKey} value={question.QuestaoKey}>
                  {question.CodigoQuestao} · {question.EixoTematico}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className={primaryButton}>
            Incluir
          </button>
        </form>
      </FormDrawer>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-slate-900">Tentativas concluídas</h2>
        {exam.Tentativas.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Nenhum aluno concluiu este simulado ainda.</p>
        ) : (
          <ul className="mt-3 divide-y divide-[#efeaff] text-sm">
            {exam.Tentativas.map((attempt) => (
              <li key={attempt.TentativaKey} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <span>
                  {attempt.Dim_Aluno_Anonimo.CodigoAlunoAnonimo}
                  <span className="text-slate-500"> · {attempt.Dim_Aluno_Anonimo.TurmaGrupo}</span>
                </span>
                <span className="text-slate-600">
                  {attempt.Acertos}/{attempt.TotalQuestoes} · {formatRate(attempt.Acertos, attempt.TotalQuestoes)}
                  {attempt.FinalizadaEm ? ` · ${formatDateTime(attempt.FinalizadaEm)}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
