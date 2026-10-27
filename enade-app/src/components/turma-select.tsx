import { fieldClass } from "@/lib/styles";

type TurmaOption = { TurmaGrupo: string };

export function TurmaSelect({
  turmas,
  name = "classGroup",
  defaultValue,
  required = true,
}: {
  turmas: TurmaOption[];
  name?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  if (turmas.length === 0) {
    return (
      <input
        name={name}
        required={required}
        maxLength={64}
        defaultValue={defaultValue}
        placeholder="Nome da turma"
        className={fieldClass}
      />
    );
  }

  return (
    <select name={name} required={required} defaultValue={defaultValue ?? ""} className={fieldClass}>
      <option value="" disabled>
        Selecione a turma
      </option>
      {turmas.map((turma) => (
        <option key={turma.TurmaGrupo} value={turma.TurmaGrupo}>
          {turma.TurmaGrupo}
        </option>
      ))}
    </select>
  );
}
