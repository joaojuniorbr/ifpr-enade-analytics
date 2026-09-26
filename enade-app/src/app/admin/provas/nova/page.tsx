import { ProvaForm } from "@/components/prova-form";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Nova prova" };

export default async function NovaProva() {
  const perguntas = await prisma.pergunta.findMany({
    where: { ativa: true },
    orderBy: { createdAt: "asc" },
    select: { id: true, enunciado: true, eixo: true, ativa: true },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Nova prova</h1>
      <ProvaForm perguntas={perguntas} selecionadasIds={[]} bloqueada={false} />
    </div>
  );
}
