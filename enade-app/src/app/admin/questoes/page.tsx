import { deleteQuestion, saveQuestion } from "@/app/admin/questoes/actions";
import { Messages, AdminTable } from "@/components/admin-table";
import { AXES, LEVELS } from "@/lib/axes";
import { primaryButton, fieldClass, cardClass } from "@/lib/styles";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Questões" };

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; error?: string }>;
}) {
  const params = await searchParams;
  const questions = await prisma.dim_Questao.findMany({ orderBy: { QuestaoKey: "asc" } });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Questões</h1>
        <p className="mt-1 text-sm text-slate-600">Dim_Questao. Código, eixo e dificuldade. Sem enunciado neste banco.</p>
      </div>
      <Messages notice={params.notice} error={params.error} />
      <form action={saveQuestion} className={`${cardClass} grid gap-3 md:grid-cols-4`}>
        <input name="code" required maxLength={32} placeholder="Código" className={fieldClass} />
        <select name="axis" required className={fieldClass} defaultValue="">
          <option value="" disabled>
            Eixo
          </option>
          {AXES.map((axis) => (
            <option key={axis}>{axis}</option>
          ))}
        </select>
        <select name="level" required className={fieldClass} defaultValue="Médio">
          {LEVELS.map((level) => (
            <option key={level}>{level}</option>
          ))}
        </select>
        <button type="submit" className={primaryButton}>
          Incluir
        </button>
      </form>
      <AdminTable
        rows={questions.map((question) => ({
          id: String(question.QuestaoKey),
          href: `/admin/questoes/${question.QuestaoKey}`,
          columns: [String(question.QuestaoKey), question.CodigoQuestao, question.EixoTematico, question.NivelDificuldade],
        }))}
        headers={["Chave", "Código", "Eixo", "Dificuldade"]}
        deleteAction={deleteQuestion}
      />
    </div>
  );
}
