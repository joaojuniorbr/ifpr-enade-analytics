import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { saveClassGroup } from "@/app/aluno/actions";
import { Notice } from "@/components/notice";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/dates";
import { formatRate } from "@/lib/format";
import { isReadyQuestion } from "@/lib/questions";
import { prisma } from "@/lib/prisma";
import { findStudent } from "@/lib/student";
import { cardClass, fieldClass, primaryButton } from "@/lib/styles";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  if (user.role === "ADMIN") redirect("/admin");

  const params = await searchParams;
  const student = await findStudent(user);
  const firstName = user.name.split(" ")[0];

  if (!student) {
    return (
      <section className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form action={saveClassGroup} className={`${cardClass} space-y-4`}>
          <p className="text-sm text-[#6d4aff]">Primeiro acesso</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Qual é a sua turma?</h1>
          <p className="text-sm leading-6 text-slate-600">
            O simulado guarda só um código anônimo e a turma. Nome e e-mail ficam no login e não entram neste banco.
          </p>
          {params.error ? <Notice tone="red" text={params.error} /> : null}
          <label className="block text-sm text-slate-700">
            Turma
            <input name="classGroup" required maxLength={64} placeholder="Ex.: ADS 2026" className={`${fieldClass} mt-1`} />
          </label>
          <button type="submit" className={primaryButton}>
            Continuar
          </button>
        </form>
        <Image
          src="/undraw-welcome.svg"
          alt="Boas-vindas, ilustração unDraw"
          width={720}
          height={540}
          unoptimized
          className="mx-auto h-auto w-full max-w-md rounded-md bg-white p-6"
        />
      </section>
    );
  }

  const exams = await prisma.dim_Simulado.findMany({
    orderBy: { NumeroAplicacao: "asc" },
    include: {
      Simulado_Questoes: { include: { Dim_Questao: { include: { Alternativas: true } } } },
      Tentativas: { where: { AlunoKey: student.AlunoKey }, orderBy: { IniciadaEm: "desc" } },
    },
  });

  return (
    <div className="space-y-4">
      <section className="grid items-center gap-6 overflow-hidden rounded-md bg-[#6d4aff] p-6 text-white md:grid-cols-[1.2fr_0.8fr] md:p-8">
        <div>
          <p className="text-sm text-white/75">Olá, {firstName}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Seus simulados</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">
            Você pode refazer cada simulado quantas vezes quiser. As perguntas mudam de ordem e o placar fica na
            evolução. Não vale nota e não substitui o ENADE oficial.
          </p>
          <Link href="/evolucao" className="mt-5 inline-flex rounded-md bg-white px-4 py-2.5 text-sm font-medium text-[#6d4aff]">
            Ver evolução
          </Link>
        </div>
        <Image
          src="/undraw-exams.svg"
          alt="Pessoas em um exame, ilustração unDraw"
          width={720}
          height={540}
          unoptimized
          className="mx-auto h-auto w-full max-w-sm rounded-md bg-white/95 p-4"
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {exams.map((exam, index) => {
          const ready = exam.Simulado_Questoes.filter((item) => isReadyQuestion(item.Dim_Questao)).length;
          const finished = exam.Tentativas.filter((attempt) => attempt.FinalizadaEm);
          const latest = finished[0];
          const open = exam.Tentativas.find((attempt) => !attempt.FinalizadaEm);
          const images = ["/undraw-quiz.svg", "/undraw-multiple-choice.svg", "/undraw-learning.svg"];
          return (
            <article key={exam.SimuladoKey} className={cardClass}>
              <div className="grid items-center gap-4 sm:grid-cols-[1fr_140px]">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#6d4aff]">
                    Aplicação {exam.NumeroAplicacao}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">{exam.DescricaoSimulado}</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {ready} {ready === 1 ? "pergunta" : "perguntas"}
                    {latest
                      ? ` · última: ${latest.Acertos}/${latest.TotalQuestoes} (${formatRate(latest.Acertos, latest.TotalQuestoes)})`
                      : " · nenhuma tentativa concluída"}
                  </p>
                  {latest?.FinalizadaEm ? (
                    <p className="mt-1 text-xs text-slate-500">{formatDateTime(latest.FinalizadaEm)}</p>
                  ) : null}
                  <Link
                    href={`/simulados/${exam.SimuladoKey}`}
                    className={`${primaryButton} mt-4 ${ready === 0 ? "pointer-events-none opacity-50" : ""}`}
                  >
                    {open ? "Continuar" : finished.length > 0 ? "Fazer de novo" : "Começar"}
                  </Link>
                </div>
                <Image
                  src={images[index % images.length]}
                  alt=""
                  width={320}
                  height={240}
                  unoptimized
                  className="mx-auto h-auto w-full"
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
