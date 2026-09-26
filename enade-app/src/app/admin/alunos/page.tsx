import { deleteStudent, saveStudent } from "@/app/admin/alunos/actions";
import { Messages, AdminTable } from "@/components/admin-table";
import { primaryButton, fieldClass, cardClass } from "@/lib/styles";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Alunos anônimos" };

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; error?: string }>;
}) {
  const params = await searchParams;
  const students = await prisma.dim_Aluno_Anonimo.findMany({ orderBy: { AlunoKey: "asc" } });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Alunos anônimos</h1>
        <p className="mt-1 text-sm text-slate-600">Dim_Aluno_Anonimo. Só código e turma. Sem nome, CPF ou e-mail.</p>
      </div>
      <Messages notice={params.notice} error={params.error} />
      <form action={saveStudent} className={`${cardClass} grid gap-3 md:grid-cols-3`}>
        <input name="code" required maxLength={32} placeholder="Aluno_013" className={fieldClass} />
        <input name="classGroup" required maxLength={64} placeholder="Turma" className={fieldClass} />
        <button type="submit" className={primaryButton}>
          Incluir
        </button>
      </form>
      <AdminTable
        headers={["Chave", "Código", "Turma"]}
        deleteAction={deleteStudent}
        rows={students.map((student) => ({
          id: String(student.AlunoKey),
          href: `/admin/alunos/${student.AlunoKey}`,
          columns: [String(student.AlunoKey), student.CodigoAlunoAnonimo, student.TurmaGrupo],
        }))}
      />
    </div>
  );
}
