import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EvolutionChart } from "@/components/evolution-chart";
import { requireStudent } from "@/lib/auth";
import { formatDayMonth } from "@/lib/dates";
import { formatRate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { findStudent } from "@/lib/student";
import { cardClass, secondaryButton } from "@/lib/styles";

export const metadata = { title: "Evolução" };

export default async function EvolutionPage() {
  const user = await requireStudent();
  const student = await findStudent(user);
  if (!student) redirect("/primeiro-acesso");

  const exams = await prisma.dim_Simulado.findMany({
    orderBy: { NumeroAplicacao: "asc" },
    include: {
      Tentativas: {
        where: { AlunoKey: student.AlunoKey, FinalizadaEm: { not: null } },
        orderBy: { FinalizadaEm: "asc" },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Evolução nos simulados</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Cada ponto é uma tentativa concluída. Refazer não apaga as anteriores.
          </p>
        </div>
        <Image
          src="/undraw-goals.svg"
          alt=""
          width={280}
          height={200}
          unoptimized
          className="hidden h-28 w-auto md:block"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {exams.map((exam) => {
          const attempts = exam.Tentativas;
          if (attempts.length === 0) {
            return (
              <article
                key={exam.SimuladoKey}
                className={`${cardClass} flex min-h-80 flex-col items-center justify-center text-center`}
              >
                <h2 className="self-start text-base font-semibold text-slate-950">{exam.DescricaoSimulado}</h2>
                <Image
                  src="/undraw-learning.svg"
                  alt=""
                  width={220}
                  height={160}
                  unoptimized
                  className="mt-6 h-32 w-auto"
                />
                <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">
                  Ainda não há tentativa concluída neste simulado.
                </p>
                <Link href="/" className={`${secondaryButton} mt-5`}>
                  Ir para os simulados
                </Link>
              </article>
            );
          }

          return (
            <article key={exam.SimuladoKey} className={cardClass}>
              <h2 className="text-base font-semibold text-slate-950">{exam.DescricaoSimulado}</h2>
              <div className="mt-4">
                <EvolutionChart
                  points={attempts.map((attempt, index) => ({
                    name: `${index + 1}ª`,
                    rate:
                      attempt.TotalQuestoes === 0
                        ? 0
                        : Math.round((attempt.Acertos / attempt.TotalQuestoes) * 1000) / 10,
                  }))}
                />
              </div>
              <ul className="mt-2 divide-y divide-[#eef1ea] text-sm">
                {[...attempts].reverse().map((attempt, index) => (
                  <li key={attempt.TentativaKey} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3">
                    <Link
                      href={`/simulados/${exam.SimuladoKey}/tentativa/${attempt.TentativaKey}`}
                      className="font-medium text-slate-800"
                    >
                      Tentativa {attempts.length - index}
                    </Link>
                    <span className="tabular-nums text-slate-700">
                      {attempt.Acertos}/{attempt.TotalQuestoes} · {formatRate(attempt.Acertos, attempt.TotalQuestoes)}
                    </span>
                    <span className="tabular-nums text-slate-500">
                      {attempt.FinalizadaEm ? formatDayMonth(attempt.FinalizadaEm) : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
