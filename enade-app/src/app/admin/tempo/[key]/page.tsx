import { notFound } from "next/navigation";
import { saveTime } from "@/app/admin/tempo/actions";
import { Messages } from "@/components/admin-table";
import { dateKey } from "@/lib/dates";
import { primaryButton, fieldClass, cardClass } from "@/lib/styles";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Editar tempo" };

export default async function EditTimePage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { key: keyParam } = await params;
  const key = Number(keyParam);
  if (!Number.isInteger(key)) notFound();
  const timeRecord = await prisma.dim_Tempo.findUnique({ where: { TempoKey: key } });
  if (!timeRecord) notFound();
  const query = await searchParams;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Tempo {timeRecord.TempoKey}</h1>
      <Messages error={query.error} />
      <form action={saveTime} className={`${cardClass} space-y-3`}>
        <input type="hidden" name="timeKey" value={timeRecord.TempoKey} />
        <label className="block text-sm text-slate-700">
          Data
          <input name="data" required type="date" defaultValue={dateKey(timeRecord.Data)} className={`${fieldClass} mt-1`} />
        </label>
        <label className="block text-sm text-slate-700">
          Ano
          <input name="year" required type="number" defaultValue={timeRecord.Ano} className={`${fieldClass} mt-1`} />
        </label>
        <label className="block text-sm text-slate-700">
          Mês
          <input name="month" required type="number" min={1} max={12} defaultValue={timeRecord.Mes} className={`${fieldClass} mt-1`} />
        </label>
        <label className="block text-sm text-slate-700">
          Nome do mês
          <input name="monthName" required maxLength={20} defaultValue={timeRecord.NomeMes} className={`${fieldClass} mt-1`} />
        </label>
        <label className="block text-sm text-slate-700">
          Semana do semestre
          <input name="semesterWeek" required type="number" min={1} defaultValue={timeRecord.SemanaSemestre} className={`${fieldClass} mt-1`} />
        </label>
        <button type="submit" className={primaryButton}>
          Salvar
        </button>
      </form>
    </div>
  );
}
