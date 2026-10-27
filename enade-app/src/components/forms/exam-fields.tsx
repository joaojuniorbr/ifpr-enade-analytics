import { saveExam } from "@/app/admin/simulados/actions";
import { dateKey } from "@/lib/dates";
import { fieldClass, primaryButton } from "@/lib/styles";

export function ExamFields({
  exam,
}: {
  exam?: {
    TempoKey: number;
    CodigoSimulado: string;
    NumeroSimulado: number;
    DescricaoSimulado: string;
    Data?: Date;
    Ano?: number;
    Mes?: number;
    NomeMes?: string;
    SemanaSemestre?: number;
  };
}) {
  const today = new Date();
  return (
    <form action={saveExam} className="space-y-3">
      {exam ? <input type="hidden" name="examKey" value={exam.TempoKey} /> : null}
      <label className="block text-sm text-slate-700">
        Código
        <input name="code" required maxLength={64} defaultValue={exam?.CodigoSimulado} placeholder="Código" className={`${fieldClass} mt-1`} />
      </label>
      <label className="block text-sm text-slate-700">
        Aplicação
        <input
          name="applicationNumber"
          required
          type="number"
          min={1}
          defaultValue={exam?.NumeroSimulado}
          placeholder="Aplicação"
          className={`${fieldClass} mt-1`}
        />
      </label>
      <label className="block text-sm text-slate-700">
        Descrição
        <input
          name="description"
          required
          maxLength={255}
          defaultValue={exam?.DescricaoSimulado}
          placeholder="Descrição"
          className={`${fieldClass} mt-1`}
        />
      </label>
      {!exam ? (
        <>
          <p className="text-sm font-medium text-slate-800">Data da aplicação (Dim_Tempo)</p>
          <label className="block text-sm text-slate-700">
            Data
            <input name="data" required type="date" defaultValue={dateKey(today)} className={`${fieldClass} mt-1`} />
          </label>
          <label className="block text-sm text-slate-700">
            Ano
            <input name="year" required type="number" defaultValue={today.getFullYear()} className={`${fieldClass} mt-1`} />
          </label>
          <label className="block text-sm text-slate-700">
            Mês
            <input name="month" required type="number" min={1} max={12} defaultValue={today.getMonth() + 1} className={`${fieldClass} mt-1`} />
          </label>
          <label className="block text-sm text-slate-700">
            Nome do mês
            <input name="monthName" required maxLength={20} defaultValue={today.toLocaleString("pt-BR", { month: "long" })} className={`${fieldClass} mt-1`} />
          </label>
          <label className="block text-sm text-slate-700">
            Semana do semestre
            <input name="semesterWeek" required type="number" min={1} defaultValue={1} className={`${fieldClass} mt-1`} />
          </label>
        </>
      ) : null}
      <button type="submit" className={primaryButton}>
        {exam ? "Salvar" : "Incluir"}
      </button>
    </form>
  );
}
