import Image from "next/image";
import Link from "next/link";
import { InlineRate, RateBar } from "@/components/rate-bar";
import { cardClass, secondaryButton } from "@/lib/styles";
import { formatCount, formatRate } from "@/lib/format";
import { loadAdminDashboard, type GroupSummary } from "@/lib/dashboard";

export const metadata = { title: "Acompanhamento" };

export default async function DashboardPage() {
  const dashboard = await loadAdminDashboard();
  const axes = [...dashboard.byAxis].reverse();
  const classes = [...dashboard.byClass].reverse();
  const worstAxis = dashboard.byAxis[0];
  const classGap = gapBetweenClasses(dashboard.byClass);
  const worstQuestion = dashboard.byQuestion[0];

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Acompanhamento do simulado</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            A taxa é acertos divididos pelas respostas registradas nesta aplicação.
          </p>
        </div>
        <Image src="/undraw-dados.svg" alt="" width={280} height={200} unoptimized className="hidden h-28 w-auto md:block" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Respostas" value={formatCount(dashboard.total)} detail="Registros nesta aplicação" />
        <Metric
          label="Acertos"
          value={formatCount(dashboard.hits)}
          detail={`${formatRate(dashboard.hits, dashboard.total)} das respostas`}
        />
        <Metric label="Taxa geral" value={formatRate(dashboard.hits, dashboard.total)} detail="Acertos ÷ respostas" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <article className={cardClass}>
          <CardTitle title="Taxa por eixo" aside="Operacional" />
          {axes.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">Nenhuma resposta gravada.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {axes.map((item) => (
                <RateBar key={item.name} label={item.name} hits={item.hits} total={item.total} />
              ))}
            </div>
          )}
        </article>

        <article className={cardClass}>
          <CardTitle title="Taxa por turma" aside="Comparativo" />
          {classes.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">Nenhuma resposta gravada.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {classes.map((item) => (
                <RateBar key={item.name} label={item.name} hits={item.hits} total={item.total} />
              ))}
            </div>
          )}
        </article>

        <article className={cardClass}>
          <CardTitle title="Insights" aside="Resumo" />
          <dl className="mt-2 divide-y divide-[#eef1ea]">
            <Insight
              label="Pior eixo"
              value={worstAxis?.name ?? "—"}
              detail={worstAxis ? `${formatRate(worstAxis.hits, worstAxis.total)} de acerto` : "Sem respostas."}
            />
            <Insight
              label="Diferença entre turmas"
              value={classGap ? `${classGap.points} p.p.` : "—"}
              detail={classGap ? `${classGap.higher} × ${classGap.lower}` : "É preciso pelo menos duas turmas."}
            />
            <Insight
              label="Questão com menor taxa"
              value={worstQuestion?.code ?? "—"}
              detail={
                worstQuestion
                  ? `${formatRate(worstQuestion.hits, worstQuestion.total)} · ${worstQuestion.axis}`
                  : "Sem respostas."
              }
            />
          </dl>
        </article>
      </div>

      <article className={cardClass}>
        <CardTitle title="Taxa por simulado" aside="Por aplicação" />
        {dashboard.byExam.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">Nenhuma resposta gravada.</p>
        ) : (
          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center">
            {dashboard.byExam.map((exam) => (
              <div key={exam.name} className="min-w-0 flex-1">
                <RateBar label={exam.name} hits={exam.hits} total={exam.total} />
              </div>
            ))}
          </div>
        )}
      </article>

      <section className={cardClass}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Por questão</h2>
            <p className="mt-1 text-sm text-slate-500">Ordenado da menor taxa a maior.</p>
          </div>
          <Link href="/admin/questoes" className={secondaryButton}>
            Cadastrar questões
          </Link>
        </div>
        {dashboard.byQuestion.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">Nenhuma questão nas respostas.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="py-3 pr-4 font-medium">Código</th>
                  <th className="py-3 pr-4 font-medium">Eixo</th>
                  <th className="py-3 pr-4 font-medium">Acertos/total</th>
                  <th className="py-3 font-medium">Taxa</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.byQuestion.map((question) => (
                  <tr key={question.code} className="border-t border-[#eef1ea]">
                    <td className="py-3.5 pr-4 font-medium text-slate-800">{question.code}</td>
                    <td className="py-3.5 pr-4 text-slate-600">{question.axis}</td>
                    <td className="py-3.5 pr-4 tabular-nums text-slate-600">
                      {question.hits}/{question.total}
                    </td>
                    <td className="py-3.5">
                      <InlineRate hits={question.hits} total={question.total} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-sm text-slate-500">
          A análise da disciplina continua no Power BI; esta tela é o acompanhamento operacional.
        </p>
      </section>
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className={cardClass}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </article>
  );
}

function CardTitle({ title, aside }: { title: string; aside: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-semibold text-slate-950">{title}</h2>
      <span className="text-xs text-slate-400">{aside}</span>
    </div>
  );
}

function Insight({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="py-4">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 text-xl font-semibold text-slate-950">{value}</dd>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

function gapBetweenClasses(classes: GroupSummary[]) {
  const ranked = classes
    .filter((item) => item.total > 0)
    .map((item) => ({ ...item, rate: item.hits / item.total }))
    .sort((a, b) => b.rate - a.rate);
  if (ranked.length < 2) return null;
  const higher = ranked[0];
  const lower = ranked[ranked.length - 1];
  const points = Math.round((higher.rate - lower.rate) * 1000) / 10;
  return { higher: higher.name, lower: lower.name, points: points.toLocaleString("pt-BR") };
}
