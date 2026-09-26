import { deleteExam, saveExam } from "@/app/admin/simulados/actions";
import { Messages, AdminTable } from "@/components/admin-table";
import { primaryButton, fieldClass, cardClass } from "@/lib/styles";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Simulados" };

export default async function ExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; error?: string }>;
}) {
  const params = await searchParams;
  const exams = await prisma.dim_Simulado.findMany({ orderBy: { NumeroAplicacao: "asc" } });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Simulados</h1>
        <p className="mt-1 text-sm text-slate-600">Dim_Simulado. Cada aplicação do semestre.</p>
      </div>
      <Messages notice={params.notice} error={params.error} />
      <form action={saveExam} className={`${cardClass} grid gap-3 md:grid-cols-4`}>
        <input name="code" required maxLength={64} placeholder="Código" className={fieldClass} />
        <input name="applicationNumber" required type="number" min={1} placeholder="Aplicação" className={fieldClass} />
        <input name="description" required maxLength={255} placeholder="Descrição" className={fieldClass} />
        <button type="submit" className={primaryButton}>
          Incluir
        </button>
      </form>
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
    </div>
  );
}
