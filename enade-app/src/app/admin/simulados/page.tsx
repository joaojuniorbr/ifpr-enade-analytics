import Link from "next/link";
import { deleteExam } from "@/app/admin/simulados/actions";
import { Messages, AdminTable } from "@/components/admin-table";
import { FormDrawer } from "@/components/form-drawer";
import { ExamFields } from "@/components/forms/exam-fields";
import { withForm } from "@/lib/forms";
import { prisma } from "@/lib/prisma";
import { primaryButton } from "@/lib/styles";

export const metadata = { title: "Simulados" };

export default async function ExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; error?: string; form?: string }>;
}) {
  const params = await searchParams;
  const exams = await prisma.dim_Tempo.findMany({ orderBy: { NumeroSimulado: "asc" } });
  const creating = params.form === "novo";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Simulados</h1>
          <p className="mt-1 text-sm text-slate-600">
            Cada simulado é uma linha de Dim_Tempo (data + número da aplicação). Abra para incluir perguntas.
          </p>
        </div>
        <Link href={withForm("/admin/simulados", params, "novo")} className={primaryButton}>
          Incluir
        </Link>
      </div>
      <Messages notice={params.notice} error={creating ? undefined : params.error} />
      <AdminTable
        headers={["Chave", "Código", "Aplicação", "Descrição"]}
        deleteAction={deleteExam}
        rows={exams.map((exam) => ({
          id: String(exam.TempoKey),
          href: `/admin/simulados/${exam.TempoKey}`,
          columns: [
            String(exam.TempoKey),
            exam.CodigoSimulado,
            String(exam.NumeroSimulado),
            exam.DescricaoSimulado,
          ],
        }))}
      />
      <FormDrawer open={creating} title="Incluir simulado" closeHref={withForm("/admin/simulados", params)}>
        <Messages error={params.error} />
        <div className="mt-4">
          <ExamFields />
        </div>
      </FormDrawer>
    </div>
  );
}
