import { saveStudent } from "@/app/admin/alunos/actions";
import { TurmaSelect } from "@/components/turma-select";
import { fieldClass, primaryButton } from "@/lib/styles";

export function StudentFields({
  student,
  turmas,
}: {
  student?: { AlunoKey: number; CodigoAlunoAnonimo: string; TurmaGrupo: string };
  turmas: { TurmaGrupo: string }[];
}) {
  return (
    <form action={saveStudent} className="space-y-3">
      {student ? <input type="hidden" name="studentKey" value={student.AlunoKey} /> : null}
      <label className="block text-sm text-slate-700">
        Código
        <input
          name="code"
          required
          maxLength={32}
          defaultValue={student?.CodigoAlunoAnonimo}
          placeholder="Aluno_013"
          className={`${fieldClass} mt-1`}
        />
      </label>
      <label className="block text-sm text-slate-700">
        Turma
        <div className="mt-1">
          <TurmaSelect turmas={turmas} defaultValue={student?.TurmaGrupo} />
        </div>
      </label>
      <button type="submit" className={primaryButton}>
        {student ? "Salvar" : "Incluir"}
      </button>
    </form>
  );
}
