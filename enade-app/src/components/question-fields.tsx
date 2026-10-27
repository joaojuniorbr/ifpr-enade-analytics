import { AXES, LEVELS } from "@/lib/axes";
import { fieldClass } from "@/lib/styles";

export function QuestionFields({
  question,
  alternatives,
  simuladoKey,
}: {
  question?: {
    QuestaoEixoKey: number;
    CodigoQuestao: string;
    EixoTematico: string;
    Enunciado: string | null;
    Dim_Dificuldade?: { Nivel: string };
    DificuldadeKey?: number;
  };
  alternatives?: { Letra: string; Texto: string; Correta: number }[];
  simuladoKey?: number;
}) {
  const levelDefault =
    question?.Dim_Dificuldade?.Nivel ??
    (question?.DificuldadeKey === 1 ? "Fácil" : question?.DificuldadeKey === 3 ? "Difícil" : "Médio");

  return (
    <>
      {question ? <input type="hidden" name="questionKey" value={question.QuestaoEixoKey} /> : null}
      {simuladoKey ? <input type="hidden" name="simuladoKey" value={simuladoKey} /> : null}
      <label className="block text-sm text-slate-700">
        Código
        <input name="code" required maxLength={32} defaultValue={question?.CodigoQuestao} placeholder="Código" className={`${fieldClass} mt-1`} />
      </label>
      <label className="block text-sm text-slate-700">
        Eixo
        <select name="axis" required defaultValue={question?.EixoTematico} className={`${fieldClass} mt-1`}>
          <option value="">Selecione</option>
          {AXES.map((axis) => (
            <option key={axis} value={axis}>
              {axis}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-slate-700">
        Dificuldade
        <select name="level" required defaultValue={levelDefault} className={`${fieldClass} mt-1`}>
          {LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-slate-700">
        Enunciado
        <textarea
          name="statement"
          required
          maxLength={4000}
          rows={4}
          defaultValue={question?.Enunciado ?? ""}
          placeholder="Enunciado"
          className={`${fieldClass} mt-1`}
        />
      </label>
      <fieldset className="space-y-2">
        <legend className="text-sm text-slate-700">Respostas (marque a correta)</legend>
        {(["A", "B", "C", "D", "E"] as const).map((letter) => {
          const alt = alternatives?.find((item) => item.Letra === letter);
          return (
            <label key={letter} className="flex items-start gap-2 text-sm text-slate-700">
              <input type="radio" name="correctLetter" value={letter} defaultChecked={alt?.Correta === 1} className="mt-1" />
              <span className="w-6 font-medium">{letter}</span>
              <input
                name={`alt-${letter}`}
                maxLength={1000}
                defaultValue={alt?.Texto ?? ""}
                placeholder={`Texto da alternativa ${letter}`}
                className={`${fieldClass} flex-1`}
              />
            </label>
          );
        })}
      </fieldset>
    </>
  );
}
