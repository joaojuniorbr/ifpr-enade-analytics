import { saveAnswer } from "@/app/admin/respostas/actions";
import { fieldClass, primaryButton } from "@/lib/styles";

function SelectField({
  name,
  label,
  value,
  empty,
  options,
}: {
  name: string;
  label: string;
  value?: number;
  empty: string;
  options: { id: number; label: string }[];
}) {
  return (
    <label className="block text-sm text-slate-700">
      {label}
      <select name={name} required defaultValue={value ?? ""} className={`${fieldClass} mt-1`}>
        <option value="">{empty}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AnswerFields({
  answer,
  timeRecords,
  students,
  questions,
}: {
  answer?: {
    RespostaKey: number;
    TempoKey: number;
    AlunoKey: number;
    QuestaoEixoKey: number;
    RespostaDada: string;
    Acertou: number;
    TempoRespostaSegundos: number | null;
  };
  timeRecords: { id: number; label: string }[];
  students: { id: number; label: string }[];
  questions: { id: number; label: string }[];
}) {
  return (
    <form action={saveAnswer} className="space-y-3">
      {answer ? <input type="hidden" name="answerKey" value={answer.RespostaKey} /> : null}
      <SelectField name="timeKey" label="Aplicação (Dim_Tempo)" value={answer?.TempoKey} empty="Aplicação" options={timeRecords} />
      <SelectField name="studentKey" label="Aluno" value={answer?.AlunoKey} empty="Aluno" options={students} />
      <SelectField name="questionKey" label="Questão" value={answer?.QuestaoEixoKey} empty="Questão" options={questions} />
      <label className="block text-sm text-slate-700">
        Resposta
        <input name="answer" required maxLength={8} defaultValue={answer?.RespostaDada} className={`${fieldClass} mt-1`} />
      </label>
      <label className="block text-sm text-slate-700">
        Acertou
        <select name="wasCorrect" required defaultValue={String(answer?.Acertou ?? 0)} className={`${fieldClass} mt-1`}>
          <option value="0">Não</option>
          <option value="1">Sim</option>
        </select>
      </label>
      <label className="block text-sm text-slate-700">
        Tempo (segundos)
        <input
          name="seconds"
          type="number"
          min={0}
          defaultValue={answer?.TempoRespostaSegundos ?? ""}
          className={`${fieldClass} mt-1`}
        />
      </label>
      <button type="submit" className={primaryButton}>
        {answer ? "Salvar" : "Incluir"}
      </button>
    </form>
  );
}
