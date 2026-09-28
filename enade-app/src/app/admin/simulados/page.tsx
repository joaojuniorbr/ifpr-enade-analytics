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
  const exams = await prisma.dim_Simulado.findMany({ orderBy: { NumeroAplicacao: "asc" } });
  const creating = params.form === "novo";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Simulados</h1>
          <p className="mt-1 text-sm text-slate-600">
            Abra um simulado para incluir perguntas e as respostas de múltipla escolha.
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
          id: String(exam.SimuladoKey),
          href: `/admin/simulados/${exam.SimuladoKey}`,
          columns: [
            String(exam.SimuladoKey),
            exam.CodigoSimulado,
            String(exam.NumeroAplicacao),
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
