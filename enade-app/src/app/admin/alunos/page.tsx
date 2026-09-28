import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteStudent } from "@/app/admin/alunos/actions";
import { Messages, AdminTable } from "@/components/admin-table";
import { FormDrawer } from "@/components/form-drawer";
import { StudentFields } from "@/components/forms/student-fields";
import { withForm } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { primaryButton } from "@/lib/styles";

export const metadata = { title: "Alunos anônimos" };

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; error?: string; form?: string }>;
}) {
  const params = await searchParams;
  const students = await prisma.dim_Aluno_Anonimo.findMany({ orderBy: { AlunoKey: "asc" } });
  const creating = params.form === "novo";
  const editingKey = Number(params.form);
  const editing = students.find((student) => student.AlunoKey === editingKey);
  if (params.form && !creating && !editing) notFound();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Alunos anônimos</h1>
          <p className="mt-1 text-sm text-slate-600">Dim_Aluno_Anonimo. Só código e turma. Sem nome, CPF ou e-mail.</p>
        </div>
        <Link href={withForm("/admin/alunos", params, "novo")} className={primaryButton}>
          Incluir
        </Link>
      </div>
      <Messages notice={params.notice} error={creating || editing ? undefined : params.error} />
      <AdminTable
        headers={["Chave", "Código", "Turma"]}
        deleteAction={deleteStudent}
        rows={students.map((student) => ({
          id: String(student.AlunoKey),
          href: withForm("/admin/alunos", params, String(student.AlunoKey)),
          columns: [String(student.AlunoKey), student.CodigoAlunoAnonimo, student.TurmaGrupo],
        }))}
      />
      <FormDrawer
        open={creating || Boolean(editing)}
        title={editing ? "Editar aluno" : "Incluir aluno"}
        closeHref={withForm("/admin/alunos", params)}
      >
        <Messages error={params.error} />
        <div className="mt-4">
          <StudentFields student={editing} />
        </div>
      </FormDrawer>
    </div>
  );
}
