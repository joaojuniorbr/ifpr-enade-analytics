import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { formatFullDate } from "@/lib/dates";
import { formatRate } from "@/lib/format";
import { isReadyQuestion } from "@/lib/questions";
import { prisma } from "@/lib/prisma";
import { findStudent } from "@/lib/student";
import { cardClass, mutedButton, primaryButton, secondaryButton } from "@/lib/styles";

const cardImages = ["/undraw-quiz.svg", "/undraw-multiple-choice.svg", "/undraw-learning.svg", "/undraw-progress.svg"];

export default async function Home() {
  const user = await requireUser();
  if (user.role === "ADMIN") redirect("/admin");

  const student = await findStudent(user);
  if (!student) redirect("/primeiro-acesso");

  const firstName = user.name.split(" ")[0];
  const exams = await prisma.dim_Simulado.findMany({
    orderBy: { NumeroAplicacao: "asc" },
    include: {
      Simulado_Questoes: { include: { Dim_Questao: { include: { Alternativas: true } } } },
      Tentativas: { where: { AlunoKey: student.AlunoKey }, orderBy: { IniciadaEm: "desc" } },
    },
  });

  return (
    <div className="space-y-8">
      <section className={`${cardClass} grid items-center gap-6 md:grid-cols-[1.2fr_0.8fr]`}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Olá, {firstName}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Você pode refazer os simulados quantas vezes quiser. A ordem das perguntas muda a cada tentativa. Este
            treino não vale nota.
          </p>
          <Link href="/evolucao" className={`${secondaryButton} mt-6`}>
            Ver evolução
          </Link>
        </div>
        <Image
          src="/undraw-studying.svg"
          alt=""
          width={640}
          height={480}
          unoptimized
          className="mx-auto h-auto w-full max-w-xs"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-950">Seus simulados</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {exams.map((exam, index) => {
            const ready = exam.Simulado_Questoes.filter((item) => isReadyQuestion(item.Dim_Questao)).length;
            const finished = exam.Tentativas.filter((attempt) => attempt.FinalizadaEm);
            const latest = finished[0];
            const open = exam.Tentativas.find((attempt) => !attempt.FinalizadaEm);
            const status = latest
              ? `${latest.Acertos}/${latest.TotalQuestoes} (${formatRate(latest.Acertos, latest.TotalQuestoes)})${
                  latest.FinalizadaEm ? ` · ${formatFullDate(latest.FinalizadaEm)}` : ""
                }`
              : open
                ? "Em andamento"
                : "Nenhuma tentativa concluída";
            const label = open ? "Continuar" : finished.length > 0 ? "Fazer de novo" : "Começar";

            return (
              <article key={exam.SimuladoKey} className={`${cardClass} flex flex-col`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-slate-500">Aplicação {exam.NumeroAplicacao}</p>
                  <Image
                    src={cardImages[index % cardImages.length]}
                    alt=""
                    width={160}
                    height={120}
                    unoptimized
                    className="h-16 w-auto"
                  />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">{exam.DescricaoSimulado}</h3>
                <p className="mt-3 text-sm text-slate-600">
                  {ready} {ready === 1 ? "pergunta" : "perguntas"}
                  {ready === 0 ? " prontas" : ""}
                </p>
                <p className="mt-1 text-sm text-slate-500">{status}</p>
                {ready === 0 ? (
                  <span className={`${mutedButton} mt-6 w-full`}>{label}</span>
                ) : (
                  <Link href={`/simulados/${exam.SimuladoKey}`} className={`${primaryButton} mt-6 w-full`}>
                    {label}
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
