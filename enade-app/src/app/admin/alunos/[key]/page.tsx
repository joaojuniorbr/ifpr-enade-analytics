import { notFound } from "next/navigation";
import { saveStudent } from "@/app/admin/alunos/actions";
import { Messages } from "@/components/admin-table";
import { primaryButton, fieldClass, cardClass } from "@/lib/styles";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Editar aluno anônimo" };

export default async function EditStudentPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { key: keyParam } = await params;
  const key = Number(keyParam);
  if (!Number.isInteger(key)) notFound();
  const student = await prisma.dim_Aluno_Anonimo.findUnique({ where: { AlunoKey: key } });
  if (!student) notFound();
  const query = await searchParams;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">{student.CodigoAlunoAnonimo}</h1>
      <Messages error={query.error} />
      <form action={saveStudent} className={`${cardClass} space-y-3`}>
        <input type="hidden" name="studentKey" value={student.AlunoKey} />
        <label className="block text-sm text-slate-700">
          Código
          <input name="code" required maxLength={32} defaultValue={student.CodigoAlunoAnonimo} className={`${fieldClass} mt-1`} />
        </label>
        <label className="block text-sm text-slate-700">
          Turma
          <input name="classGroup" required maxLength={64} defaultValue={student.TurmaGrupo} className={`${fieldClass} mt-1`} />
        </label>
        <button type="submit" className={primaryButton}>
          Salvar
        </button>
      </form>
    </div>
  );
}
