import { notFound } from "next/navigation";
import { saveExam } from "@/app/admin/simulados/actions";
import { Messages } from "@/components/admin-table";
import { primaryButton, fieldClass, cardClass } from "@/lib/styles";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Editar simulado" };

export default async function EditExamPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { key: keyParam } = await params;
  const key = Number(keyParam);
  if (!Number.isInteger(key)) notFound();
  const exam = await prisma.dim_Simulado.findUnique({ where: { SimuladoKey: key } });
  if (!exam) notFound();
  const query = await searchParams;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Simulado {exam.SimuladoKey}</h1>
      <Messages error={query.error} />
      <form action={saveExam} className={`${cardClass} space-y-3`}>
        <input type="hidden" name="examKey" value={exam.SimuladoKey} />
        <label className="block text-sm text-slate-700">
          Código
          <input name="code" required maxLength={64} defaultValue={exam.CodigoSimulado} className={`${fieldClass} mt-1`} />
        </label>
        <label className="block text-sm text-slate-700">
          Aplicação
          <input name="applicationNumber" required type="number" min={1} defaultValue={exam.NumeroAplicacao} className={`${fieldClass} mt-1`} />
        </label>
        <label className="block text-sm text-slate-700">
          Descrição
          <input name="description" required maxLength={255} defaultValue={exam.DescricaoSimulado} className={`${fieldClass} mt-1`} />
        </label>
        <button type="submit" className={primaryButton}>
          Salvar
        </button>
      </form>
    </div>
  );
}
