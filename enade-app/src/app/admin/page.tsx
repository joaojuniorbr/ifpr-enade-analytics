import Link from "next/link";
import { DashboardCharts } from "@/components/dashboard-charts";
import { cardClass } from "@/lib/styles";
import { formatRate, toChartPoints } from "@/lib/format";
import { loadAdminDashboard, type GroupSummary, type QuestionSummary } from "@/lib/dashboard";

export const metadata = { title: "Acompanhamento" };

export default async function DashboardPage() {
  const dashboard = await loadAdminDashboard();
  const worstAxis = dashboard.byAxis[0];
  const classGap = gapBetweenClasses(dashboard.byClass);
  const worstQuestion = dashboard.byQuestion[0];

  return (
    <div className="space-y-4">
      <section className="grid items-center gap-6 overflow-hidden rounded-[28px] bg-[#6d4aff] p-6 text-white md:grid-cols-[1.3fr_0.7fr] md:p-8">
        <div>
          <p className="text-sm text-white/75">Bem-vindo de volta</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Acompanhamento do simulado</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">
            Totais de Fato_Respostas. A taxa é acertos divididos pelas respostas. O dashboard da
            disciplina continua no Power BI Desktop.
          </p>
        </div>
        <img
          src="/undraw-dados.svg"
          alt=""
          className="mx-auto w-full max-w-xs rounded-3xl bg-white/95 p-4"
        />
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <article className={cardClass}>
          <p className="text-sm text-slate-500">Respostas</p>
          <p className="mt-2 text-3xl font-semibold">{dashboard.total}</p>
        </article>
        <article className={cardClass}>
          <p className="text-sm text-slate-500">Acertos</p>
          <p className="mt-2 text-3xl font-semibold">{dashboard.hits}</p>
        </article>
        <article className={cardClass}>
          <p className="text-sm text-slate-500">Taxa geral</p>
          <p className="mt-2 text-3xl font-semibold">{formatRate(dashboard.hits, dashboard.total)}</p>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Insight
          label="Pior eixo"
          value={worstAxis?.name ?? "—"}
          detail={worstAxis ? `${worstAxis.hits}/${worstAxis.total} · ${formatRate(worstAxis.hits, worstAxis.total)}` : "Sem respostas."}
        />
        <Insight
          label="Diferença entre turmas"
          value={classGap ? `${classGap.points} p.p.` : "—"}
          detail={
            classGap
              ? `${classGap.higher} acima de ${classGap.lower}`
              : "É preciso pelo menos duas turmas."
          }
        />
        <Insight
          label="Questão com menor taxa"
          value={worstQuestion?.code ?? "—"}
          detail={
            worstQuestion
              ? `${worstQuestion.axis} · ${formatRate(worstQuestion.hits, worstQuestion.total)}`
              : "Sem respostas."
          }
        />
      </div>

      <DashboardCharts
        axes={toChartPoints(dashboard.byAxis)}
        classes={toChartPoints(dashboard.byClass)}
        exams={toChartPoints(dashboard.byExam)}
      />

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-slate-900">Por questão</h2>
        <p className="mt-1 text-sm text-slate-500">Da menor taxa para a maior.</p>
        {dashboard.byQuestion.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">Nenhuma questão nas respostas.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {dashboard.byQuestion.map((question) => (
              <QuestionBar key={question.code} question={question} />
            ))}
          </ul>
        )}
        <p className="mt-4 text-sm">
          <Link href="/admin/questoes" className="font-medium text-[#6d4aff] hover:underline">
            Cadastrar questões
          </Link>
        </p>
      </section>
    </div>
  );
}

function Insight({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className={cardClass}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold leading-snug break-words text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{detail}</p>
    </article>
  );
}

function QuestionBar({ question }: { question: QuestionSummary }) {
  const width = question.total <= 0 ? 0 : Math.round((question.hits / question.total) * 1000) / 10;
  return (
    <li>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-slate-900">{question.code}</span>
        <span className="text-slate-600">
          {question.hits}/{question.total} · {formatRate(question.hits, question.total)}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-slate-500">{question.axis}</p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#efeaff]">
        <div className="h-full rounded-full bg-[#6d4aff]" style={{ width: `${width}%` }} />
      </div>
    </li>
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
