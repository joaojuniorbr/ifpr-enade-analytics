import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteQuestion, saveQuestion } from "@/app/admin/questoes/actions";
import { Messages, AdminTable } from "@/components/admin-table";
import { FormDrawer } from "@/components/form-drawer";
import { QuestionFields } from "@/components/question-fields";
import { withForm } from "@/lib/forms";
import { correctLetter, isReadyQuestion } from "@/lib/questions";
import { prisma } from "@/lib/prisma";
import { primaryButton } from "@/lib/styles";

export const metadata = { title: "Questões" };

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    notice?: string;
    error?: string;
    form?: string;
    simulado?: string;
  }>;
}) {
  const params = await searchParams;
  const questions = await prisma.dim_Questao_Eixo.findMany({
    orderBy: { QuestaoEixoKey: "asc" },
    include: {
      Alternativas: { orderBy: { Letra: "asc" } },
      Dim_Dificuldade: true,
    },
  });
  const creating = params.form === "novo";
  const editingKey = Number(params.form);
  const editing = questions.find(
    (question) => question.QuestaoEixoKey === editingKey
  );
  if (params.form && !creating && !editing) notFound();
  const simuladoKey = Number(params.simulado);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Questões</h1>
          <p className="mt-1 text-sm text-slate-600">
            Dim_Questao_Eixo — eixo temático e dificuldade (Dim_Dificuldade).
          </p>
        </div>
        <Link
          href={withForm("/admin/questoes", params, "novo")}
          className={primaryButton}
        >
          Incluir
        </Link>
      </div>
      <Messages
        notice={params.notice}
        error={creating || editing ? undefined : params.error}
      />
      <AdminTable
        rows={questions.map((question) => ({
          id: String(question.QuestaoEixoKey),
          href: withForm(
            "/admin/questoes",
            params,
            String(question.QuestaoEixoKey)
          ),
          columns: [
            String(question.QuestaoEixoKey),
            question.CodigoQuestao,
            question.EixoTematico,
            question.Dim_Dificuldade.Nivel,
            isReadyQuestion(question)
              ? `Pronta · correta ${correctLetter(question.Alternativas)}`
              : "Incompleta",
          ],
        }))}
        headers={["Chave", "Código", "Eixo", "Dificuldade", "Respostas"]}
        deleteAction={deleteQuestion}
      />
      <FormDrawer
        open={creating || Boolean(editing)}
        title={editing ? "Editar pergunta" : "Incluir pergunta"}
        closeHref={withForm("/admin/questoes", params)}
      >
        <Messages error={params.error} />
        <form action={saveQuestion} className="mt-4 space-y-3">
          <QuestionFields
            question={editing}
            alternatives={editing?.Alternativas}
            simuladoKey={
              Number.isInteger(simuladoKey) && simuladoKey > 0
                ? simuladoKey
                : undefined
            }
          />
        </form>
      </FormDrawer>
    </div>
  );
}
