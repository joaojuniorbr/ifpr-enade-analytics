import { saveExam } from "@/app/admin/simulados/actions";
import { fieldClass, primaryButton } from "@/lib/styles";

export function ExamFields({
  exam,
}: {
  exam?: {
    SimuladoKey: number;
    CodigoSimulado: string;
    NumeroAplicacao: number;
    DescricaoSimulado: string;
  };
}) {
  return (
    <form action={saveExam} className="space-y-3">
      {exam ? <input type="hidden" name="examKey" value={exam.SimuladoKey} /> : null}
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
          defaultValue={exam?.NumeroAplicacao}
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
      <button type="submit" className={primaryButton}>
        {exam ? "Salvar" : "Incluir"}
      </button>
    </form>
  );
}
