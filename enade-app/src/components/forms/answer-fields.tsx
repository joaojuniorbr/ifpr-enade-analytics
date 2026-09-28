import { saveAnswer } from "@/app/admin/respostas/actions";
import { fieldClass, primaryButton } from "@/lib/styles";

type Option = { id: number; label: string };

export function AnswerFields({
  answer,
  dates,
  students,
  questions,
  exams,
}: {
  answer?: {
    RespostaKey: number;
    TempoKey: number;
    AlunoKey: number;
    QuestaoKey: number;
    SimuladoKey: number;
    RespostaDada: string;
    Acertou: number;
    TempoRespostaSegundos: number | null;
  };
  dates: Option[];
  students: Option[];
  questions: Option[];
  exams: Option[];
}) {
  return (
    <form action={saveAnswer} className="space-y-3">
      {answer ? <input type="hidden" name="answerKey" value={answer.RespostaKey} /> : null}
      <Choice name="timeKey" label="Data" value={answer?.TempoKey} empty="Data" options={dates} />
      <Choice name="studentKey" label="Aluno" value={answer?.AlunoKey} empty="Aluno" options={students} />
      <Choice name="questionKey" label="Questão" value={answer?.QuestaoKey} empty="Questão" options={questions} />
      <Choice name="examKey" label="Simulado" value={answer?.SimuladoKey} empty="Simulado" options={exams} />
      <label className="block text-sm text-slate-700">
        Resposta
        <input name="answer" required maxLength={8} defaultValue={answer?.RespostaDada} placeholder="Resposta" className={`${fieldClass} mt-1`} />
      </label>
      <label className="block text-sm text-slate-700">
        Resultado
        <select name="wasCorrect" required defaultValue={answer ? String(answer.Acertou) : "0"} className={`${fieldClass} mt-1`}>
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
          defaultValue={answer?.TempoRespostaSegundos ?? ""}
          placeholder="Segundos"
          className={`${fieldClass} mt-1`}
        />
      </label>
      <button type="submit" className={primaryButton}>
        {answer ? "Salvar" : "Incluir"}
      </button>
    </form>
  );
}

function Choice({
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
  options: Option[];
}) {
  return (
    <label className="block text-sm text-slate-700">
      {label}
      <select name={name} required defaultValue={value ?? ""} className={`${fieldClass} mt-1`}>
        {value == null ? (
          <option value="" disabled>
            {empty}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
