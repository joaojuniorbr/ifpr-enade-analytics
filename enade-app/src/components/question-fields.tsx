import { AXES, LEVELS } from "@/lib/axes";
import { LETTERS } from "@/lib/validation";
import { fieldClass, primaryButton } from "@/lib/styles";

type AlternativeValue = { Letra: string; Texto: string; Correta: number };

export function QuestionFields({
  question,
  alternatives = [],
  simuladoKey,
}: {
  question?: {
    QuestaoKey: number;
    CodigoQuestao: string;
    EixoTematico: string;
    NivelDificuldade: string;
    Enunciado: string | null;
  };
  alternatives?: AlternativeValue[];
  simuladoKey?: number;
}) {
  const byLetter = new Map(alternatives.map((item) => [item.Letra, item]));
  const marked = alternatives.find((item) => item.Correta === 1)?.Letra ?? "A";

  return (
    <>
      {question ? <input type="hidden" name="questionKey" value={question.QuestaoKey} /> : null}
      {simuladoKey ? <input type="hidden" name="simuladoKey" value={simuladoKey} /> : null}
      <label className="block text-sm text-slate-700">
        Código
        <input
          name="code"
          required
          maxLength={32}
          defaultValue={question?.CodigoQuestao}
          placeholder="Código"
          className={`${fieldClass} mt-1`}
        />
      </label>
      <label className="block text-sm text-slate-700">
        Eixo
        <select name="axis" required defaultValue={question?.EixoTematico ?? ""} className={`${fieldClass} mt-1`}>
          <option value="" disabled>
            Eixo
          </option>
          {AXES.map((axis) => (
            <option key={axis}>{axis}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-slate-700">
        Dificuldade
        <select name="level" required defaultValue={question?.NivelDificuldade ?? "Médio"} className={`${fieldClass} mt-1`}>
          {LEVELS.map((level) => (
            <option key={level}>{level}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-slate-700">
        Enunciado
        <textarea
          name="statement"
          required
          maxLength={4000}
          rows={5}
          defaultValue={question?.Enunciado ?? ""}
          placeholder="Texto da pergunta"
          className={`${fieldClass} mt-1`}
        />
      </label>
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-800">Respostas</legend>
        <p className="text-sm text-slate-500">Preencha pelo menos duas. Marque a única correta.</p>
        {LETTERS.map((letter) => (
          <div key={letter} className="grid grid-cols-[auto_1fr] items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="radio" name="correctLetter" value={letter} defaultChecked={marked === letter} required />
              {letter}
            </label>
            <input
              name={`alt-${letter}`}
              maxLength={1000}
              defaultValue={byLetter.get(letter)?.Texto ?? ""}
              placeholder={`Resposta ${letter}`}
              className={fieldClass}
            />
          </div>
        ))}
      </fieldset>
      <button type="submit" className={primaryButton}>
        {question ? "Salvar" : "Incluir pergunta"}
      </button>
    </>
  );
}
