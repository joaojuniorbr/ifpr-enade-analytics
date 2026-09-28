import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { startAttempt } from "@/app/simulados/actions";
import { Notice } from "@/components/notice";
import { requireStudent } from "@/lib/auth";
import { formatDateTime } from "@/lib/dates";
import { formatRate } from "@/lib/format";
import { isReadyQuestion } from "@/lib/questions";
import { prisma } from "@/lib/prisma";
import { findStudent } from "@/lib/student";
import { cardClass, primaryButton, secondaryButton } from "@/lib/styles";

export const metadata = { title: "Simulado" };

export default async function ExamPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireStudent();
  const student = await findStudent(user);
  if (!student) notFound();

  const { key: keyParam } = await params;
  const key = Number(keyParam);
  if (!Number.isInteger(key)) notFound();
  const exam = await prisma.dim_Simulado.findUnique({
    where: { SimuladoKey: key },
    include: {
      Simulado_Questoes: { include: { Dim_Questao: { include: { Alternativas: true } } } },
      Tentativas: { where: { AlunoKey: student.AlunoKey }, orderBy: { IniciadaEm: "desc" } },
    },
  });
  if (!exam) notFound();

  const query = await searchParams;
  const ready = exam.Simulado_Questoes.filter((item) => isReadyQuestion(item.Dim_Questao)).length;
  const open = exam.Tentativas.find((attempt) => !attempt.FinalizadaEm);
  const finished = exam.Tentativas.filter((attempt) => attempt.FinalizadaEm);

  return (
    <div className="mx-auto grid max-w-5xl items-start gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <section className={cardClass}>
          <p className="text-sm text-[#6d4aff]">Aplicação {exam.NumeroAplicacao}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{exam.DescricaoSimulado}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {ready} {ready === 1 ? "pergunta" : "perguntas"} de múltipla escolha. A ordem é sorteada quando a tentativa
            começa e permanece a mesma se você continuar depois.
          </p>
          {query.error ? (
            <div className="mt-4">
              <Notice tone="red" text={query.error} />
            </div>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-3">
            {open ? (
              <Link href={`/simulados/${exam.SimuladoKey}/tentativa/${open.TentativaKey}`} className={primaryButton}>
                Continuar tentativa
              </Link>
            ) : (
              <form action={startAttempt}>
                <input type="hidden" name="examKey" value={exam.SimuladoKey} />
                <button type="submit" className={primaryButton} disabled={ready === 0}>
                  {finished.length > 0 ? "Nova tentativa" : "Começar"}
                </button>
              </form>
            )}
            <Link href="/evolucao" className={secondaryButton}>
              Ver evolução
            </Link>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="font-semibold text-slate-900">Tentativas anteriores</h2>
          {finished.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">Ainda não há tentativa concluída neste simulado.</p>
          ) : (
            <ul className="mt-3 divide-y divide-[#efeaff] text-sm">
              {finished.map((attempt, index) => (
                <li key={attempt.TentativaKey} className="flex items-center justify-between gap-3 py-3">
                  <Link
                    href={`/simulados/${exam.SimuladoKey}/tentativa/${attempt.TentativaKey}`}
                    className="font-medium text-[#6d4aff]"
                  >
                    Tentativa {finished.length - index}
                  </Link>
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
      <Image
        src="/undraw-online-test.svg"
        alt="Prova online, ilustração unDraw"
        width={720}
        height={540}
        unoptimized
        className="mx-auto h-auto w-full rounded-md bg-white p-6"
      />
    </div>
  );
}
