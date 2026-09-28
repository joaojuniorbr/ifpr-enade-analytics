import { saveStudent } from "@/app/admin/alunos/actions";
import { fieldClass, primaryButton } from "@/lib/styles";

export function StudentFields({
  student,
}: {
  student?: { AlunoKey: number; CodigoAlunoAnonimo: string; TurmaGrupo: string };
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
        <input
          name="classGroup"
          required
          maxLength={64}
          defaultValue={student?.TurmaGrupo}
          placeholder="Turma"
          className={`${fieldClass} mt-1`}
        />
      </label>
      <button type="submit" className={primaryButton}>
        {student ? "Salvar" : "Incluir"}
      </button>
    </form>
  );
}
