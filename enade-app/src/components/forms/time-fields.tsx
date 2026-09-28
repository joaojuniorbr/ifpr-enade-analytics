import { saveTime } from "@/app/admin/tempo/actions";
import { dateKey } from "@/lib/dates";
import { fieldClass, primaryButton } from "@/lib/styles";

export function TimeFields({
  timeRecord,
}: {
  timeRecord?: {
    TempoKey: number;
    Data: Date;
    Ano: number;
    Mes: number;
    NomeMes: string;
    SemanaSemestre: number;
  };
}) {
  return (
    <form action={saveTime} className="space-y-3">
      {timeRecord ? <input type="hidden" name="timeKey" value={timeRecord.TempoKey} /> : null}
      <label className="block text-sm text-slate-700">
        Data
        <input name="data" required type="date" defaultValue={timeRecord ? dateKey(timeRecord.Data) : undefined} className={`${fieldClass} mt-1`} />
      </label>
      <label className="block text-sm text-slate-700">
        Ano
        <input name="year" required type="number" defaultValue={timeRecord?.Ano} placeholder="Ano" className={`${fieldClass} mt-1`} />
      </label>
      <label className="block text-sm text-slate-700">
        Mês
        <input name="month" required type="number" min={1} max={12} defaultValue={timeRecord?.Mes} placeholder="Mês" className={`${fieldClass} mt-1`} />
      </label>
      <label className="block text-sm text-slate-700">
        Nome do mês
        <input name="monthName" required maxLength={20} defaultValue={timeRecord?.NomeMes} placeholder="Nome do mês" className={`${fieldClass} mt-1`} />
      </label>
      <label className="block text-sm text-slate-700">
        Semana do semestre
        <input
          name="semesterWeek"
          required
          type="number"
          min={1}
          defaultValue={timeRecord?.SemanaSemestre}
          placeholder="Semana do semestre"
          className={`${fieldClass} mt-1`}
        />
      </label>
      <button type="submit" className={primaryButton}>
        {timeRecord ? "Salvar" : "Incluir"}
      </button>
    </form>
  );
}
