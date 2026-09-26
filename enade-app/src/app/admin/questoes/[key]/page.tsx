import { notFound } from "next/navigation";
import { saveQuestion } from "@/app/admin/questoes/actions";
import { Messages } from "@/components/admin-table";
import { AXES, LEVELS } from "@/lib/axes";
import { primaryButton, fieldClass, cardClass } from "@/lib/styles";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Editar questão" };

export default async function EditQuestionPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { key: keyParam } = await params;
  const key = Number(keyParam);
  if (!Number.isInteger(key)) notFound();
  const question = await prisma.dim_Questao.findUnique({ where: { QuestaoKey: key } });
  if (!question) notFound();
  const query = await searchParams;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Questão {question.QuestaoKey}</h1>
      <Messages error={query.error} />
      <form action={saveQuestion} className={`${cardClass} space-y-3`}>
        <input type="hidden" name="questionKey" value={question.QuestaoKey} />
        <label className="block text-sm text-slate-700">
          Código
          <input name="code" required maxLength={32} defaultValue={question.CodigoQuestao} className={`${fieldClass} mt-1`} />
        </label>
        <label className="block text-sm text-slate-700">
          Eixo
          <select name="axis" required defaultValue={question.EixoTematico} className={`${fieldClass} mt-1`}>
            {AXES.map((axis) => (
              <option key={axis}>{axis}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-slate-700">
          Dificuldade
          <select name="level" required defaultValue={question.NivelDificuldade} className={`${fieldClass} mt-1`}>
            {LEVELS.map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </label>
        <button type="submit" className={primaryButton}>
          Salvar
        </button>
      </form>
    </div>
  );
}
