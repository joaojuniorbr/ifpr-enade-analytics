import { deleteTime, saveTime } from "@/app/admin/tempo/actions";
import { Messages, AdminTable } from "@/components/admin-table";
import { formatDate } from "@/lib/dates";
import { primaryButton, fieldClass, cardClass } from "@/lib/styles";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Tempo" };

export default async function TimePage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; error?: string }>;
}) {
  const params = await searchParams;
  const timeRecords = await prisma.dim_Tempo.findMany({ orderBy: { Data: "asc" } });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Tempo</h1>
        <p className="mt-1 text-sm text-slate-600">Dim_Tempo. Uma linha por data de aplicação.</p>
      </div>
      <Messages notice={params.notice} error={params.error} />
      <form action={saveTime} className={`${cardClass} grid gap-3 md:grid-cols-3`}>
        <input name="data" required type="date" className={fieldClass} />
        <input name="year" required type="number" placeholder="Ano" className={fieldClass} />
        <input name="month" required type="number" min={1} max={12} placeholder="Mês" className={fieldClass} />
        <input name="monthName" required maxLength={20} placeholder="Nome do mês" className={fieldClass} />
        <input name="semesterWeek" required type="number" min={1} placeholder="Semana do semestre" className={fieldClass} />
        <button type="submit" className={primaryButton}>
          Incluir
        </button>
      </form>
      <AdminTable
        headers={["Chave", "Data", "Ano", "Mês", "Semana"]}
        deleteAction={deleteTime}
        rows={timeRecords.map((timeRecord) => ({
          id: String(timeRecord.TempoKey),
          href: `/admin/tempo/${timeRecord.TempoKey}`,
          columns: [
            String(timeRecord.TempoKey),
            formatDate(timeRecord.Data),
            String(timeRecord.Ano),
            timeRecord.NomeMes,
            String(timeRecord.SemanaSemestre),
          ],
        }))}
      />
    </div>
  );
}
