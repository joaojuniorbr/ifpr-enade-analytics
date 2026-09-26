import { notFound } from "next/navigation";
import { saveAnswer } from "@/app/admin/respostas/actions";
import { Messages } from "@/components/admin-table";
import { primaryButton, fieldClass, cardClass } from "@/lib/styles";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Editar resposta" };

export default async function EditAnswerPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { key: keyParam } = await params;
  const key = Number(keyParam);
  if (!Number.isInteger(key)) notFound();
  const [answer, timeRecords, students, questions, exams] = await Promise.all([
    prisma.fato_Respostas.findUnique({ where: { RespostaKey: key } }),
    prisma.dim_Tempo.findMany({ orderBy: { TempoKey: "asc" } }),
    prisma.dim_Aluno_Anonimo.findMany({ orderBy: { AlunoKey: "asc" } }),
    prisma.dim_Questao.findMany({ orderBy: { QuestaoKey: "asc" } }),
    prisma.dim_Simulado.findMany({ orderBy: { NumeroAplicacao: "asc" } }),
  ]);
  if (!answer) notFound();
  const query = await searchParams;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Resposta {answer.RespostaKey}</h1>
      <Messages error={query.error} />
      <form action={saveAnswer} className={`${cardClass} space-y-3`}>
        <input type="hidden" name="answerKey" value={answer.RespostaKey} />
        <SelectField fieldName="timeKey" label="Data" value={answer.TempoKey} options={timeRecords.map((item) => ({ id: item.TempoKey, label: `${item.NomeMes}/${item.Ano}` }))} />
        <SelectField fieldName="studentKey" label="Aluno" value={answer.AlunoKey} options={students.map((item) => ({ id: item.AlunoKey, label: item.CodigoAlunoAnonimo }))} />
        <SelectField fieldName="questionKey" label="Questão" value={answer.QuestaoKey} options={questions.map((item) => ({ id: item.QuestaoKey, label: item.CodigoQuestao }))} />
        <SelectField fieldName="examKey" label="Simulado" value={answer.SimuladoKey} options={exams.map((item) => ({ id: item.SimuladoKey, label: item.CodigoSimulado }))} />
        <label className="block text-sm text-slate-700">
          Resposta
          <input name="answer" required maxLength={8} defaultValue={answer.RespostaDada} className={`${fieldClass} mt-1`} />
        </label>
        <label className="block text-sm text-slate-700">
          Resultado
          <select name="wasCorrect" required defaultValue={String(answer.Acertou)} className={`${fieldClass} mt-1`}>
            <option value="1">Acertou</option>
            <option value="0">Errou</option>
          </select>
        </label>
        <label className="block text-sm text-slate-700">
          Segundos
          <input
            name="seconds"
            type="number"
            min={0}
            step="0.01"
            defaultValue={answer.TempoRespostaSegundos ?? ""}
            className={`${fieldClass} mt-1`}
          />
        </label>
        <button type="submit" className={primaryButton}>
          Salvar
        </button>
      </form>
    </div>
  );
}

function SelectField({
  fieldName,
  label,
  value,
  options,
}: {
  fieldName: string;
  label: string;
  value: number;
  options: { id: number; label: string }[];
}) {
  return (
    <label className="block text-sm text-slate-700">
      {label}
      <select name={fieldName} required defaultValue={value} className={`${fieldClass} mt-1`}>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
