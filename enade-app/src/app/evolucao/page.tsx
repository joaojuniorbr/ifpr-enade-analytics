import Image from "next/image";
import Link from "next/link";
import { EvolutionChart } from "@/components/evolution-chart";
import { requireStudent } from "@/lib/auth";
import { formatDateTime } from "@/lib/dates";
import { formatRate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { findStudent } from "@/lib/student";
import { cardClass, primaryButton } from "@/lib/styles";

export const metadata = { title: "Evolução" };

export default async function EvolutionPage() {
  const user = await requireStudent();
  const student = await findStudent(user);
  const attempts = student
    ? await prisma.tentativa.findMany({
        where: { AlunoKey: student.AlunoKey, FinalizadaEm: { not: null } },
        include: { Dim_Simulado: true },
        orderBy: { FinalizadaEm: "asc" },
      })
    : [];

  const byExam = new Map<number, typeof attempts>();
  for (const attempt of attempts) {
    const group = byExam.get(attempt.SimuladoKey) ?? [];
    group.push(attempt);
    byExam.set(attempt.SimuladoKey, group);
  }

  return (
    <div className="space-y-4">
      <section className="grid items-center gap-6 overflow-hidden rounded-md bg-white p-6 shadow-[0_10px_30px_rgba(90,70,180,0.06)] md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm text-[#6d4aff]">Seu histórico</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Evolução nos simulados</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Cada ponto é uma tentativa concluída. Refazer o simulado não apaga as anteriores.
          </p>
        </div>
        <Image
          src="/undraw-goals.svg"
          alt="Metas pessoais, ilustração unDraw"
          width={720}
          height={540}
          unoptimized
          className="mx-auto h-auto w-full max-w-sm"
        />
      </section>

      {attempts.length === 0 ? (
        <section className="grid items-center gap-6 rounded-md bg-[#6d4aff] p-6 text-white md:grid-cols-[1fr_220px]">
          <div>
            <h2 className="text-2xl font-semibold">Ainda não há tentativa concluída</h2>
            <p className="mt-2 text-sm text-white/80">Comece um simulado para ver os acertos aqui.</p>
            <Link href="/" className="mt-5 inline-flex rounded-md bg-white px-4 py-2.5 text-sm font-medium text-[#6d4aff]">
              Ir para os simulados
            </Link>
          </div>
          <Image
            src="/undraw-learning.svg"
            alt=""
            width={320}
            height={240}
            unoptimized
            className="mx-auto h-auto w-full rounded-md bg-white/95 p-3"
          />
        </section>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {[...byExam.values()].map((group) => {
            const name = group[0]?.Dim_Simulado.DescricaoSimulado ?? "Simulado";
            return (
              <div key={group[0]?.SimuladoKey} className="space-y-4">
                <EvolutionChart
                  title={name}
                  points={group.map((attempt, index) => ({
                    name: `${index + 1}ª`,
                    rate:
                      attempt.TotalQuestoes === 0
                        ? 0
                        : Math.round((attempt.Acertos / attempt.TotalQuestoes) * 1000) / 10,
                  }))}
                />
                <article className={cardClass}>
                  <ul className="divide-y divide-[#efeaff] text-sm">
                    {group.map((attempt, index) => (
                      <li key={attempt.TentativaKey} className="flex items-center justify-between gap-3 py-3">
                        <Link
                          href={`/simulados/${attempt.SimuladoKey}/tentativa/${attempt.TentativaKey}`}
                          className="font-medium text-[#6d4aff]"
                        >
                          {index + 1}ª tentativa
                        </Link>
                        <span className="text-slate-600">
                          {attempt.Acertos}/{attempt.TotalQuestoes} · {formatRate(attempt.Acertos, attempt.TotalQuestoes)}
                          {attempt.FinalizadaEm ? ` · ${formatDateTime(attempt.FinalizadaEm)}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            );
          })}
        </div>
      )}
      <Link href="/" className={primaryButton}>
        Fazer um simulado
      </Link>
    </div>
  );
}
